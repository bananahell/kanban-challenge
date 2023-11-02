import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3334);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3334');
  });
  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    const dto: AuthDto = {
      name: 'Nhe',
      email: 'teste@gmail.com',
      password: 'cool-pass-bruh',
    };
    describe('Sign up', () => {
      it('Success', () => {
        return pactum.spec().post('/auth/signUp').withBody(dto).expectStatus(201);
      });
      it('Empty password', () => {
        return pactum.spec().post('/auth/signUp').withBody({ email: dto.email }).expectStatus(400);
      });
      it('Empty email', () => {
        return pactum
          .spec()
          .post('/auth/signUp')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('Empty body', () => {
        return pactum.spec().post('/auth/signUp').expectStatus(400);
      });
    });
    describe('Sign in', () => {
      it('Success', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token');
      });
      it('Empty password', () => {
        return pactum.spec().post('/auth/signIn').withBody({ email: dto.email }).expectStatus(400);
      });
      it('Empty email', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('Empty body', () => {
        return pactum.spec().post('/auth/signIn').expectStatus(400);
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('Success', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
      it('No header', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });
      it('No bearer', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: '$S{userAccessToken}' })
          .expectStatus(401);
      });
    });
    describe('Edit user', () => {
      const dto: EditUserDto = {
        name: 'Pedro Nogueira',
        email: 'anotheremail@hotmail.com',
      };
      it('Edit name and email', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.email);
      });
    });
  });
});
