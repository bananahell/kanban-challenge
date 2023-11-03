import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBoardDto, EditBoardDto } from '../src/board/dto';

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
        return pactum.spec().post('/auth/signUp').withBody(dto).expectStatus(HttpStatus.CREATED);
      });
      it('Empty password', () => {
        return pactum
          .spec()
          .post('/auth/signUp')
          .withBody({ email: dto.email })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Empty email', () => {
        return pactum
          .spec()
          .post('/auth/signUp')
          .withBody({ password: dto.password })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Empty body', () => {
        return pactum.spec().post('/auth/signUp').expectStatus(HttpStatus.BAD_REQUEST);
      });
    });
    describe('Sign in', () => {
      it('Success', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .stores('userAccessToken', 'access_token');
      });
      it('Empty password', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody({ email: dto.email })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Empty email', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody({ password: dto.password })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Empty body', () => {
        return pactum.spec().post('/auth/signIn').expectStatus(HttpStatus.BAD_REQUEST);
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
          .expectStatus(HttpStatus.OK)
          .stores('userId', 'id');
      });
      it('No header', () => {
        return pactum.spec().get('/users/me').expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('No bearer', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: '$S{userAccessToken}' })
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
    });
    describe('Edit user', () => {
      const dto: EditUserDto = {
        name: 'Pedro Nogueira',
        email: 'anotheremail@hotmail.com',
      };
      it('Edit name and email correctly', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.email);
      });
    });
  });
  describe('Beginning', () => {
    const dtoCreate: CreateBoardDto = {
      title: 'Very Large Guy Investments Kanban Board',
      background: '../../assets/very-cool-background.png',
    };
    const dtoEdit: EditBoardDto = {
      title: 'Lincoln did not like the name Kanban Board',
    };
    describe('Create first board', () => {
      it('Return no boards', () => {
        return pactum
          .spec()
          .get('/boards')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(HttpStatus.OK)
          .expectBody([]);
      });
      it('Create board', () => {
        return pactum
          .spec()
          .post('/boards')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dtoCreate)
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(dtoCreate.title)
          .expectBodyContains(dtoCreate.background)
          .stores('boardId', 'id');
      });
      it('Get board by id', () => {
        return pactum
          .spec()
          .get('/boards/{id}')
          .withPathParams('id', '$S{boardId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dtoCreate.title)
          .expectBodyContains(dtoCreate.background);
      });
      it('Edit board by id', () => {
        return pactum
          .spec()
          .patch('/boards/{id}')
          .withPathParams('id', '$S{boardId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dtoEdit)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dtoEdit.title)
          .expectBodyContains(dtoCreate.background);
      });
      it('Add board user', () => {
        return pactum
          .spec()
          .patch('/{boardId}/add-user/{userId}')
          .withPathParams('boardId', '$S{boardId}')
          .withPathParams('userId', '$S{userId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .inspect();
      }); /*
      it('Delete board by id', () => {
        return pactum
          .spec()
          .delete('/boards/{id}')
          .withPathParams('id', '$S{boardId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(HttpStatus.NO_CONTENT)
          .inspect();
      });*/
    });
  });
});
