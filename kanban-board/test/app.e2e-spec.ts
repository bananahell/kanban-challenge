import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBoardDto, EditBoardDto } from '../src/board/dto';
import { CreateTagDto } from '../src/tag/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Setting all of test suite and cleaning database before testing
  //////////////////////////////////////////////////////////////////////////////////////////////////
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

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Creates 3 users, edits the second, and gets all 3 to get their JWT tokens
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const dtoUser1: AuthDto = {
    name: 'Nhe',
    email: 'teste@gmail.com',
    password: 'cool-pass-bruh',
  };
  const dtoUser2: AuthDto = {
    name: 'Ble',
    email: 'teste4@gmail.com',
    password: 'cool-pass-bruh',
  };
  const dtoUser3: AuthDto = {
    name: 'Qui',
    email: 'teste3@gmail.com',
    password: 'cool-pass-bruh',
  };
  const dtoEditUser2: EditUserDto = {
    name: 'Blo',
    email: 'teste2@gmail.com',
  };
  describe('Create users', () => {
    it('Create user 1', () => {
      return pactum
        .spec()
        .post('/auth/signUp')
        .withBody(dtoUser1)
        .expectStatus(HttpStatus.CREATED)
        .stores('userAccessToken1', 'access_token');
    });
    it('Create user 2', () => {
      return pactum
        .spec()
        .post('/auth/signUp')
        .withBody(dtoUser2)
        .expectStatus(HttpStatus.CREATED)
        .stores('userAccessToken2', 'access_token');
    });
    it('Create user 3', () => {
      return pactum
        .spec()
        .post('/auth/signUp')
        .withBody(dtoUser3)
        .expectStatus(HttpStatus.CREATED)
        .stores('userAccessToken3', 'access_token');
    });
    it('Edit user 2', () => {
      return pactum
        .spec()
        .patch('/users')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
        .withBody(dtoEditUser2)
        .expectStatus(HttpStatus.OK)
        .expectBodyContains(dtoEditUser2.name)
        .expectBodyContains(dtoEditUser2.email);
    });
    it('Get user 1', () => {
      return pactum
        .spec()
        .get('/users/me')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .expectStatus(HttpStatus.OK)
        .stores('userId1', 'id');
    });
    it('Get user 2', () => {
      return pactum
        .spec()
        .get('/users/me')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
        .expectStatus(HttpStatus.OK)
        .stores('userId2', 'id');
    });
    it('Get user 3', () => {
      return pactum
        .spec()
        .get('/users/me')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken3}' })
        .expectStatus(HttpStatus.OK)
        .stores('userId3', 'id');
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Creates board 1 and 3 with owner as user 1, board 2 with owner as user 2, edits second board,
  //   and adds user 3 to boards 1 and 2
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const dtoBoard1: CreateBoardDto = {
    title: 'Very Large Guy Industries Kanban Board',
    background: '../../assets/very-cool-background.png',
  };
  const dtoBoard2: CreateBoardDto = {
    title: 'Something something idk Kanban Board',
  };
  const dtoBoard3: CreateBoardDto = {
    title: 'Third and last Kanban Board',
    background: '../../assets/very-cool-background-final-version-i-swear.png',
  };
  const dtoEditBoard2: EditBoardDto = {
    background: '#FFFFFF',
  };
  let dtoBoardUser1: { boardId: string; userId: string };
  let dtoBoardUser2: { boardId: string; userId: string };
  describe('Create boards', () => {
    it('Create board 1', () => {
      return pactum
        .spec()
        .post('/boards')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoBoard1)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoBoard1.title)
        .expectBodyContains(dtoBoard1.background)
        .stores('boardId1', 'id');
    });
    it('Create board 2', () => {
      return pactum
        .spec()
        .post('/boards')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
        .withBody(dtoBoard2)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoBoard2.title)
        .stores('boardId2', 'id');
    });
    it('Create board 3', () => {
      return pactum
        .spec()
        .post('/boards')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoBoard3)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoBoard3.title)
        .expectBodyContains(dtoBoard3.background)
        .stores('boardId3', 'id');
    });
    it('Edit board 2', () => {
      return pactum
        .spec()
        .patch('/boards/{id}')
        .withPathParams('id', '$S{boardId2}')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
        .withBody(dtoEditBoard2)
        .expectStatus(HttpStatus.OK)
        .expectBodyContains(dtoEditBoard2.background);
    });
    dtoBoardUser1 = { boardId: '$S{boardId2}', userId: '$S{userId3}' };
    it('Add user 3 to board 2', () => {
      return pactum
        .spec()
        .patch('/boards/add-user/')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
        .withBody(dtoBoardUser1)
        .expectStatus(HttpStatus.OK);
    });
    dtoBoardUser2 = { boardId: '$S{boardId1}', userId: '$S{userId3}' };
    it('Add user 3 to board 1', () => {
      return pactum
        .spec()
        .patch('/boards/add-user/')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoBoardUser2)
        .expectStatus(HttpStatus.OK);
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Creates 2 tags
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const dtoTagImportant: CreateTagDto = {
    name: 'IMPORTANT',
  };
  const dtoTagUrgent: CreateTagDto = {
    name: 'URGENT',
  };
  describe('Create tags', () => {
    it('Create important tag', () => {
      return pactum
        .spec()
        .post('/tags')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoTagImportant)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoTagImportant.name)
        .stores('tagId1', 'id');
    });
    it('Create urgent tag', () => {
      return pactum
        .spec()
        .post('/tags')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken3}' })
        .withBody(dtoTagUrgent)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoTagUrgent.name)
        .stores('tagId2', 'id');
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Creates a "To do" and a "Done" status list to each of the 3 boards
  //////////////////////////////////////////////////////////////////////////////////////////////////
  let dtoBoard1ToDo: { name: any; position: any; boardId?: string };
  let dtoBoard1Done: { name: any; position: any; boardId?: string };
  let dtoBoard2ToDo: { name: any; position: any; boardId?: string };
  let toBoard2Done: { name: any; position: any; boardId?: string };
  let dtoBoard3ToDo: { name: any; position: any; boardId?: string };
  let dtoBoard3Done: { name: any; position: any; boardId?: string };
  describe('Create status lists', () => {
    dtoBoard1ToDo = { name: 'To do', position: 0, boardId: '$S{boardId1}' };
    it('Create board 1 to do', () => {
      return pactum
        .spec()
        .post('/status-lists')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoBoard1ToDo)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoBoard1ToDo.name)
        .expectBodyContains(dtoBoard1ToDo.position)
        .stores('statusListId1', 'id');
    });
    dtoBoard1Done = { name: 'Done', position: 1, boardId: '$S{boardId1}' };
    it('Create board 1 done', () => {
      return pactum
        .spec()
        .post('/status-lists')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoBoard1Done)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoBoard1Done.name)
        .expectBodyContains(dtoBoard1Done.position)
        .stores('statusListId2', 'id');
    });
    dtoBoard2ToDo = { name: 'To do', position: 0, boardId: '$S{boardId2}' };
    it('Create board 2 to do', () => {
      return pactum
        .spec()
        .post('/status-lists')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
        .withBody(dtoBoard2ToDo)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoBoard2ToDo.name)
        .expectBodyContains(dtoBoard2ToDo.position)
        .stores('statusListId3', 'id');
    });
    toBoard2Done = { name: 'Done', position: 1, boardId: '$S{boardId2}' };
    it('Create board 2 done', () => {
      return pactum
        .spec()
        .post('/status-lists')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
        .withBody(toBoard2Done)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(toBoard2Done.name)
        .expectBodyContains(toBoard2Done.position)
        .stores('statusListId4', 'id');
    });
    dtoBoard3ToDo = { name: 'To do', position: 0, boardId: '$S{boardId3}' };
    it('Create board 3 to do', () => {
      return pactum
        .spec()
        .post('/status-lists')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoBoard3ToDo)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoBoard3ToDo.name)
        .expectBodyContains(dtoBoard3ToDo.position)
        .stores('statusListId5', 'id');
    });
    dtoBoard3Done = { name: 'Done', position: 1, boardId: '$S{boardId3}' };
    it('Create board 3 done', () => {
      return pactum
        .spec()
        .post('/status-lists')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoBoard3Done)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoBoard3Done.name)
        .expectBodyContains(dtoBoard3Done.position)
        .stores('statusListId6', 'id');
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Creates 4 cards for board 1, 2 cards for board 2, and 3 cards for board 3
  //////////////////////////////////////////////////////////////////////////////////////////////////
  let dtoCard1: {
    title: any;
    description?: string;
    statusListId?: string;
    tagId?: string;
    beginDate?: Date;
    endDate?: Date;
  };
  let dtoCard2: {
    title: any;
    description?: string;
    statusListId?: string;
    tagId?: string;
    beginDate?: Date;
    endDate?: Date;
  };
  let dtoCard3: {
    title: any;
    description?: string;
    statusListId?: string;
    tagId?: string;
    beginDate?: Date;
    endDate?: Date;
  };
  let dtoCard4: {
    title: any;
    description?: string;
    statusListId?: string;
    tagId?: string;
    beginDate?: Date;
    endDate?: Date;
  };
  let dtoCard5: {
    title: any;
    description?: string;
    statusListId?: string;
    tagId?: string;
    beginDate?: Date;
    endDate?: Date;
  };
  let dtoCard6: {
    title: any;
    description?: string;
    statusListId?: string;
    tagId?: string;
    beginDate?: Date;
    endDate?: Date;
  };
  let dtoCard7: {
    title: any;
    description?: string;
    statusListId?: string;
    tagId?: string;
    beginDate?: Date;
    endDate?: Date;
  };
  let dtoCard8: {
    title: any;
    description?: string;
    statusListId?: string;
    tagId?: string;
    beginDate?: Date;
    endDate?: Date;
  };
  let dtoCard9: {
    title: any;
    description?: string;
    statusListId?: string;
    tagId?: string;
    beginDate?: Date;
    endDate?: Date;
  };
  describe('Create cards', () => {
    dtoCard1 = {
      title: 'Create controllers',
      statusListId: '$S{statusListId1}',
      tagId: '$S{tagId1}',
      beginDate: new Date(Date.now()),
      endDate: new Date('2023-11-09T09:00:00'),
    };
    it('Create board 1 1st card', () => {
      return pactum
        .spec()
        .post('/cards')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoCard1)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoCard1.title)
        .stores('cardId1', 'id');
    });
    dtoCard2 = {
      title: 'Create services',
      statusListId: '$S{statusListId1}',
      tagId: '$S{tagId1}',
    };
    it('Create board 1 2nd card', () => {
      return pactum
        .spec()
        .post('/cards')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoCard2)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoCard2.title)
        .stores('cardId2', 'id');
    });
    dtoCard3 = {
      title: 'Create tests',
      statusListId: '$S{statusListId1}',
    };
    it('Create board 1 3rd card', () => {
      return pactum
        .spec()
        .post('/cards')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoCard3)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoCard3.title)
        .stores('cardId3', 'id');
    });
    dtoCard4 = {
      title: 'Create comments',
      statusListId: '$S{statusListId1}',
      description: 'Just in case I finish all the stuff before',
    };
    it('Create board 1 4th card', () => {
      return pactum
        .spec()
        .post('/cards')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoCard4)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoCard4.title)
        .stores('cardId4', 'id');
    });
    dtoCard5 = {
      title: 'Chew gum',
      statusListId: '$S{statusListId4}',
      tagId: '$S{tagId2}',
    };
    it('Create board 2 1st card', () => {
      return pactum
        .spec()
        .post('/cards')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
        .withBody(dtoCard5)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoCard5.title)
        .stores('cardId5', 'id');
    });
    dtoCard6 = {
      title: 'Kick ass',
      statusListId: '$S{statusListId3}',
      tagId: '$S{tagId1}',
    };
    it('Create board 2 2nd card', () => {
      return pactum
        .spec()
        .post('/cards')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
        .withBody(dtoCard6)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoCard6.title)
        .stores('cardId6', 'id');
    });
    dtoCard7 = {
      title: 'Run with my uni project',
      statusListId: '$S{statusListId5}',
      tagId: '$S{tagId2}',
    };
    it('Create board 3 1st card', () => {
      return pactum
        .spec()
        .post('/cards')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoCard7)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoCard7.title)
        .stores('cardId7', 'id');
    });
    dtoCard8 = {
      title: 'Cry because of uni bad professors',
      statusListId: '$S{statusListId6}',
      tagId: null,
    };
    it('Create board 3 2nd card', () => {
      return pactum
        .spec()
        .post('/cards')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoCard8)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoCard8.title)
        .stores('cardId8', 'id');
    });
    dtoCard9 = {
      title: 'Hold on to dying internship',
      statusListId: '$S{statusListId5}',
      tagId: '$S{tagId1}',
    };
    it('Create board 3 3rd card', () => {
      return pactum
        .spec()
        .post('/cards')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoCard9)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoCard9.title)
        .stores('cardId9', 'id');
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Creates a comment in card 3 and another in card 5
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const dtoComment1 = {
    message: 'This should do the trick, right? I really want this job =/',
    cardId: '$S{cardId3}',
  };
  const dtoComment2 = {
    message: 'And I am all out of that',
    cardId: '$S{cardId5}',
  };
  describe('Create comments', () => {
    it('Comment card 3', () => {
      return pactum
        .spec()
        .post('/comments')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoComment1)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoComment1.message)
        .stores('commentId1', 'id');
    });
    it('Comment card 5', () => {
      return pactum
        .spec()
        .post('/comments')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
        .withBody(dtoComment2)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoComment2.message)
        .stores('commentId2', 'id');
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Creates an attachment in card 3 and another in card 8
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const dtoAttachment1 = { content: '../docs/back-end-job.pdf', cardId: '$S{cardId3}' };
  const dtoAttachment2 = { content: '../failed-tests/bad-lecture.xls', cardId: '$S{cardId8}' };
  describe('Create attachments', () => {
    it('Attachment for card 3', () => {
      return pactum
        .spec()
        .post('/attachments')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoAttachment1)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoAttachment1.content)
        .stores('attachmentId1', 'id');
    });
    it('Attachment for card 8', () => {
      return pactum
        .spec()
        .post('/attachments')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoAttachment2)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoAttachment2.content)
        .stores('attachmentId2', 'id');
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Creates a checklist for card 1 and another for card 7
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const dtoChecklist1 = { title: 'To do before the 9th', cardId: '$S{cardId1}' };
  const dtoChecklist2 = { title: 'Point cloud requirements', cardId: '$S{cardId7}' };
  describe('Create checklists', () => {
    it('Checklist for card 1', () => {
      return pactum
        .spec()
        .post('/checklists')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoChecklist1)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoChecklist1.title)
        .stores('checklistId1', 'id');
    });
    it('Checklist for card 7', () => {
      return pactum
        .spec()
        .post('/checklists')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoChecklist2)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoChecklist2.title)
        .stores('checklistId2', 'id');
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Creates 1 item for checklist 1 and 2 items for checklist 2
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const dtoChecklistItem1 = {
    description: 'Finish the damn thing',
    checklistId: '$S{checklistId1}',
  };
  const dtoChecklistItem2 = {
    description: 'Find best lossy technique to apply',
    checklistId: '$S{checklistId2}',
  };
  const dtoChecklistItem3 = {
    description: 'Apply technique on best psnr per bits ratio slices',
    checklistId: '$S{checklistId2}',
  };
  describe('Checklist item for checklist 1', () => {
    it('Checklist item 1 for checklist 1', () => {
      return pactum
        .spec()
        .post('/checklist-items')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoChecklistItem1)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoChecklistItem1.description)
        .stores('checklistItemId1', 'id');
    });
    it('Checklist item 1 for checklist 2', () => {
      return pactum
        .spec()
        .post('/checklist-items')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoChecklistItem2)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoChecklistItem2.description)
        .stores('checklistItemId2', 'id');
    });
    it('Checklist item 2 for checklist 2', () => {
      return pactum
        .spec()
        .post('/checklist-items')
        .withHeaders({ Authorization: 'Bearer $S{userAccessToken1}' })
        .withBody(dtoChecklistItem3)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(dtoChecklistItem3.description)
        .stores('checklistItemId3', 'id');
    });
  });
});
