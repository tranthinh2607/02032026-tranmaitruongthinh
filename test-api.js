async function runTests() {
    const baseUrl = 'http://127.0.0.1:3000/api/v1';
    console.log('--- Starting API Tests ---');

    const headers = { 'Content-Type': 'application/json' };

    // 1. Create a Role
    console.log('\n[POST] /roles - Create Role');
    const roleResponse = await fetch(`${baseUrl}/roles`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: `Admin_${Date.now()}`, description: 'Administrator' })
    });
    const roleData = await roleResponse.json();
    console.log(roleData);
    if (!roleData.success) throw new Error('Failed to create role');
    const roleId = roleData.data._id;

    // 2. Get Roles
    console.log('\n[GET] /roles - Get all Roles');
    const rolesRes = await fetch(`${baseUrl}/roles`);
    console.log(await rolesRes.json());

    // 3. Create a User
    console.log('\n[POST] /users - Create User');
    const userPayload = {
        username: `user_${Date.now()}`,
        password: 'password123',
        email: `user${Date.now()}@example.com`,
        fullName: 'Test User',
        role: roleId
    };
    const userResponse = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userPayload)
    });
    const userData = await userResponse.json();
    console.log(userData);
    if (!userData.success) throw new Error('Failed to create user');
    const userId = userData.data._id;

    // 4. Get Users
    console.log('\n[GET] /users - Get all Users');
    const usersRes = await fetch(`${baseUrl}/users`);
    console.log(await usersRes.json());

    // 5. Enable User
    console.log('\n[POST] /users/enable - Enable User');
    const enableRes = await fetch(`${baseUrl}/users/enable`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: userPayload.email, username: userPayload.username })
    });
    console.log(await enableRes.json());

    // 6. Disable User
    console.log('\n[POST] /users/disable - Disable User');
    const disableRes = await fetch(`${baseUrl}/users/disable`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: userPayload.email, username: userPayload.username })
    });
    console.log(await disableRes.json());

    // 7. Put Role
    console.log(`\n[PUT] /roles/${roleId} - Update Role`);
    const updateRoleRes = await fetch(`${baseUrl}/roles/${roleId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ description: 'Updated Administrator Role' })
    });
    console.log(await updateRoleRes.json());

    // 8. Delete User (Soft Delete)
    console.log(`\n[DELETE] /users/${userId} - Delete User`);
    const deleteUserRes = await fetch(`${baseUrl}/users/${userId}`, { method: 'DELETE' });
    console.log(await deleteUserRes.json());

    // 9. Delete Role (Soft Delete)
    console.log(`\n[DELETE] /roles/${roleId} - Delete Role`);
    const deleteRoleRes = await fetch(`${baseUrl}/roles/${roleId}`, { method: 'DELETE' });
    console.log(await deleteRoleRes.json());

    console.log('\n--- Tests Completed Successfully ---');
}

runTests().catch(console.error);
