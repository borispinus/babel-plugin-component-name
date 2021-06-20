function transform({
  types: t
}) {
  return {
    name: 'component-name',
    visitor: {
      FunctionDeclaration: function (path, state) {
        var _path$node, _path$node$id;

        const jsx = doesReturnJSX(path.node.body);
        const name = (_path$node = path.node) === null || _path$node === void 0 ? void 0 : (_path$node$id = _path$node.id) === null || _path$node$id === void 0 ? void 0 : _path$node$id.name;

        if (jsx && name) {
          insertDataAttribute(jsx, name, t);
        }
      },
      FunctionExpression: function (path, state) {
        var _path$node2, _path$node2$id;

        const jsx = doesReturnJSX(path.node.body);
        const name = (_path$node2 = path.node) === null || _path$node2 === void 0 ? void 0 : (_path$node2$id = _path$node2.id) === null || _path$node2$id === void 0 ? void 0 : _path$node2$id.name;

        if (jsx && name) {
          insertDataAttribute(jsx, name, t);
        }
      },
      ArrowFunctionExpression: function (path, state) {
        const jsx = doesReturnJSX(path.node.body);

        if (jsx) {
          var _path$find;

          const parentNode = (_path$find = path.find(path => t.isVariableDeclarator(path.node) || t.isJSXElement(path.node))) === null || _path$find === void 0 ? void 0 : _path$find.node;

          if (t.isVariableDeclarator(parentNode)) {
            var _parentNode$id;

            const name = (_parentNode$id = parentNode.id) === null || _parentNode$id === void 0 ? void 0 : _parentNode$id.name;
            if (name) insertDataAttribute(jsx, name, t);
          }
        }
      }
    }
  };
}

function insertDataAttribute(body, name, t) {
  const openingElement = body === null || body === void 0 ? void 0 : body.openingElement;

  if (openingElement) {
    openingElement.attributes.push(t.JSXAttribute(t.jSXIdentifier('data-component'), t.stringLiteral(name)));
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
