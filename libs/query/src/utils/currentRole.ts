interface RoleObject {
  [key: string]: boolean;
}

export const generateRoleObject = (roles: { name: string }[]): RoleObject => {
  return roles.reduce((acc, role) => {
    acc[`is${role.name}`] = true;
    return acc;
  }, {} as RoleObject);
};

// export const generateRoleObject = (roles: { name: string }[]): RoleObject => {
//     const result: RoleObject = {};
//     for (const role of roles) {
//       result[`is${role.name}`] = true;
//     }
//     return result;
//   };
