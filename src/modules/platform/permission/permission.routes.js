const path = require('path');


module.exports = (app) => {
    app.route('/api/permissions')
        .get("get permissions")
        .post("create permission")

    app.route("/api/permissions/:id")
        .get("get by id")
        .put("update permission")
        .delete("delete permission");
}