export const seedData = {
  users: [
    { id: 'u1', username: 'demo', password: '123456', avatar: 'https://i.pravatar.cc/120?img=3', joinedAt: new Date().toISOString(), karma: 120 },
  ],
  communities: [
    { id: 'c1', name: 'reactjs', description: 'All things React', members: ['u1'] },
    { id: 'c2', name: 'frontend', description: 'Frontend discussion', members: ['u1'] },
  ],
  posts: [
    {
      id: 'p1',
      title: 'Welcome to Reddit Clone',
      content: 'This is a portfolio-ready demo app with ReactJS.',
      communityId: 'c1',
      authorId: 'u1',
      imageUrl: '',
      votes: { u1: 1 },
      createdAt: new Date().toISOString(),
    },
  ],
  comments: [],
};
