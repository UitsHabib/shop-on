const path = require('path');


module.exports = (app) => {
    app.route('/api/permissions')
        .get("get permissions")
        .post("create permission")
        .put("update permission")
        .delete("delete permission");
}