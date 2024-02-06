// Replace the existing content with the todo controller
module.exports = {
    all: function (req, res) {
        res.send('All todos');
    },
    viewOne: function (req, res) {
        console.log('Viewing ' + req.params.id);
    },
    create: function (req, res) {
        console.log('Todo created');
    },
    destroy: function (req, res) {
        console.log('Todo deleted');
    },
    edit: function (req, res) {
        console.log('Todo ' + req.params.id + ' updated');
    }
};
