const request = require('supertest');
const app = require('../app'); // Aquí debes importar tu aplicación de Express

describe('POST /registrar', () => {
  it('should registrar a new user and return status 201', async () => {
    const userData = {
      nombre: 'Juan',
      email: 'juan@example.com',
      password: '12345',
      rol: 'cliente'
    };

    const response = await request(app)
      .post('/registrar') // Ruta de registro
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('msg', 'Usuario registrado');
    expect(response.body).toHaveProperty('id');
  });

  it('should return an error if email is missing', async () => {
    const userData = {
      nombre: 'Juan',
      password: '12345',
      rol: 'cliente'
    };

    const response = await request(app)
      .post('/registrar')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'Todos los campos son obligatorios');
  });

  it('should return an error if password is missing', async () => {
    const userData = {
      nombre: 'Juan',
      email: 'juan@example.com',
      rol: 'cliente'
    };

    const response = await request(app)
      .post('/registrar')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'Todos los campos son obligatorios');
  });
});

describe('POST /login', () => {
  it('should login and return a token', async () => {
    const loginData = {
      email: 'juan@example.com',
      password: '12345'
    };

    const response = await request(app)
      .post('/auth/login') // Ruta de login
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return an error for incorrect credentials', async () => {
    const loginData = {
      email: 'juan@example.com',
      password: 'wrongpassword'
    };

    const response = await request(app)
      .post('/auth/login')
      .send(loginData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'Credenciales incorrectas');
  });

  it('should return an error if email is missing', async () => {
    const loginData = {
      password: '12345'
    };

    const response = await request(app)
      .post('/auth/login')
      .send(loginData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'El email y la contraseña son requeridos');
  });

  it('should return an error if password is missing', async () => {
    const loginData = {
      email: 'juan@example.com'
    };

    const response = await request(app)
      .post('/auth/login')
      .send(loginData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('msg', 'El email y la contraseña son requeridos');
  });
});
