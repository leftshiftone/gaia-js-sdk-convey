// eslint-disable-next-line no-undef
window.data = {
  name: 'root',
  children: [
    {
      name: 'account',
      children: [{
        name: 'account',
        children: [{ name: 'account', children: [{ name: 'account', size: 1 }] }],
      }],
    },
    {
      name: 'home',
      children: [{
        name: 'account',
        children: [{ name: 'account', children: [{ name: 'account', size: 1 }] }, {
          name: 'account',
          children: [{ name: 'account', size: 2 }],
        }],
      }, {
        name: 'account',
        children: [{
          name: 'account',
          children: [{ name: 'account', size: 1 }],
        }, {
          name: 'account',
          children: [{ name: 'account', size: 1 }, { name: 'account', size: 1 }],
        }],
      }, {
        name: 'account',
        children: [{ name: 'account', children: [{ name: 'account', size: 1 }] }],
      }],
    },
    {
      name: 'product',
      children: [{
        name: 'account',
        children: [{
          name: 'account',
          children: [{ name: 'account', size: 1 }, { name: 'account', size: 1 }],
        }, { name: 'account', children: [{ name: 'account', size: 1 }] }, {
          name: 'account',
          children: [{ name: 'account', size: 1 }],
        }],
      }, {
        name: 'account',
        children: [{
          name: 'account',
          children: [{ name: 'account', size: 1 }, {
            name: 'account',
            size: 1,
          }, { name: 'account', size: 1 }],
        }, {
          name: 'account',
          children: [{ name: 'account', size: 1 }, { name: 'account', size: 2 }],
        }, { name: 'account', children: [{ name: 'account', size: 4 }, { name: 'account', size: 1 }] }],
      }, {
        name: 'account',
        children: [{
          name: 'account',
          children: [{ name: 'account', size: 1 }, { name: 'account', size: 1 }],
        }, {
          name: 'account',
          children: [{ name: 'account', size: 1 }, { name: 'account', size: 7 }],
        }, { name: 'account', children: [{ name: 'account', size: 2 }] }],
      }],
    },
  ],
};
