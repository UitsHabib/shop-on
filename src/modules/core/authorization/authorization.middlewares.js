const path = require("path");
const {getUserWithPermissionRelations} = require(path.join(process.cwd(), "src/modules/platform/user/permission/permission.js"));

async function getUserWithProfiles(id){ 
    const userWithPermissions = await getUserWithPermissionRelations({id});
    return userWithPermissions;
}

async function getProfilePermissions(profile) { 
    // const services = [];
    // if(profile){
    //     for(const userProfilePermission of profile.userPermissions){
    //         let permission = userProfilePermission.permission;
    //             for(const ps of permission.permissions){
                    
    //             }
    //     }
    // }
}

async function getRolePermissions(role) { }

async function isPermitted(userServices, allowedServices) {
    if(userServices.some( userService => allowedServices.includes(userService))){
        return true;
    }
    return false;
}



const ServiceGuard = (allowedServices) =>{
    return async function(req, res, next){
        const user = await getUserWithProfiles(req.user.id);
        const profileServices = await getProfilePermissions(user.profile);
        const roleServices = await getRolePermissions(user.role);
        const userServices  = profileServices.concat(roleServices);

        if(!isPermitted(userServices, allowedServices)){
            return res.status(403).send("Forbidden. You are not authorized.");
        } 

        next();
    }    
}

module.exports.ServiceGuard = ServiceGuard;