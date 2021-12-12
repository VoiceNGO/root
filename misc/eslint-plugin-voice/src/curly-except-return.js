const BLOCK_STATEMENT = 'BlockStatement';
const IF_STATEMENT = 'IfStatement';
const RETURN_STATEMENT = 'ReturnStatement';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require braces around statements, except for returns immediately following an if',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingCurlyAfter: "Expected { after '{{name}}'.",
      missingCurlyAfterCondition: "Expected { after '{{name}}' condition.",
    },
  },

  create: function create(context) {
    function check(node, nodeContent, name, condition) {
      if (nodeContent.type === BLOCK_STATEMENT) return;
      if (node.type === IF_STATEMENT && nodeContent.type === RETURN_STATEMENT)
        return;

      context.report({
        node,
        loc: nodeContent.loc,
        messageId: `missingCurlyAfter${condition ? 'Condition' : ''}`,
        data: { name },
      });
    }

    return {
      IfStatement(node) {
        check(node, node.consequent, 'if', true);
      },

      WhileStatement(node) {
        check(node, node.body, 'while');
      },

      DoWhileStatement(node) {
        check(node, node.body, 'do', true);
      },

      ForStatement(node) {
        check(node, node.body, 'for', true);
      },

      ForInStatement(node) {
        check(node, node.body, 'for-in');
      },

      ForOfStatement(node) {
        check(node, node.body, 'for-of');
      },
    };
  },
};
