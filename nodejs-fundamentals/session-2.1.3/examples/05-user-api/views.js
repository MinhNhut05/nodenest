/**
 * HTML templates
 */

export const homePageHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>User API</title>
  <style>
    body { font-family: Arial; max-width: 500px; margin: 50px auto; padding: 20px; }
    input, button { padding: 10px; margin: 5px 0; width: 100%; box-sizing: border-box; }
    button { background: #007bff; color: white; border: none; cursor: pointer; }
  </style>
</head>
<body>
  <h2>User API</h2>
  <form action="/api/users" method="POST">
    <input type="text" name="name" placeholder="Name" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="number" name="age" placeholder="Age">
    <button type="submit">Create User</button>
  </form>
  <p><a href="/api/users">View all users</a></p>
</body>
</html>
`;
