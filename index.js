function transform({types: t}) {
    return {
        name: 'component-name',
        visitor: {
            FunctionDeclaration: function (path, state) {
                const jsx = doesReturnJSX(path.node.body);
                const name = path.node?.id?.name;
                if (jsx && name) {
                    insertDataAttribute(jsx, name, t);
                }
            },
            FunctionExpression: function (path, state) {
                const jsx = doesReturnJSX(path.node.body);
                const name = path.node?.id?.name;
                if (jsx && name) {
                    insertDataAttribute(jsx, name, t);
                }
            },
            ArrowFunctionExpression: function (path, state) {
                const jsx = doesReturnJSX(path.node.body);
                if (jsx) {
                    const parentNode = path.find(path => t.isVariableDeclarator(path.node) || t.isJSXElement(path.node))?.node;
                    if (t.isVariableDeclarator(parentNode)) {
                        const name =  parentNode.id?.name;
                        if (name) insertDataAttribute(jsx, name, t);
                    }
                }
            },
        },
    };
}

function insertDataAttribute(body, name, t) {
    const openingElement = body?.openingElement;
    if (openingElement) {
        openingElement.attributes.push(t.JSXAttribute(t.jSXIdentifier('data-component'),  t.stringLiteral(name)))
    }
}

function doesReturnJSX(body) {
    if (!body) return false;
    if (body.type === 'JSXElement') {
        return body;
    }

    let block = body.body;
    if (block && block.length) {
        let lastBlock = block.slice(0).pop();
        if (lastBlock.type === 'ReturnStatement') {
            if (lastBlock.argument !== null && lastBlock.argument.type === 'JSXElement') {
                return lastBlock.argument;
            }
        }
    }
    return false;
}

module.exports = transform;
