import { Role } from './Role';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from './secretKey';

export const FakeAPI = (() => {
    const USER_AUTHENTICATE = '/users/authenticate';
    const USER_AUTHORIZATION = '/users/authorization';
    const USER_REFRESH_TOKEN = '/users/authenticate/refreshToken';

    let _users = [
        { id: 0, email: 'admin@gmail.com', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin, gender: null, age: null },
        { id: 1, email: 'user@gmail.com', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User, gender: 'Male', age: 20 }
    ];

    const _news = [
        {
            id: '1',
            title: '1The return of the legendary US airline you\'ve probably never heard of',
            description: 'Miami-based Eastern Airlines\' inaugural flight to New York from the Ecuadorian city of Guayaquil was the first flight to carry the once legendary Eastern name since the failure of the two earlier airlines -- the first in 1991 and the second short-lived iteration in 2017.'
        }, {
            id: '2',
            title: '2Inside one of the world\'s newest (and wettest!) national parks',
            description: 'Some 1.8 million years ago, the Paraná River -- South America\'s second-longest after the Amazon -- carved a rambling path through Argentina\'s Corrientes Province before shifting to its modern location farther west, scientists believe.'
        }, {
            id: '3',
            title: '3Inside one of the world\'s newest (and wettest!) national parks',
            description: 'Some 1.8 million years ago, the Paraná River -- South America\'s second-longest after the Amazon -- carved a rambling path through Argentina\'s Corrientes Province before shifting to its modern location farther west, scientists believe.'
        }, {
            id: '4',
            title: '4Inside one of the world\'s newest (and wettest!) national parks',
            description: 'Some 1.8 million years ago, the Paraná River -- South America\'s second-longest after the Amazon -- carved a rambling path through Argentina\'s Corrientes Province before shifting to its modern location farther west, scientists believe.'
        }, {
            id: '5',
            title: '5Inside one of the world\'s newest (and wettest!) national parks',
            description: 'Some 1.8 million years ago, the Paraná River -- South America\'s second-longest after the Amazon -- carved a rambling path through Argentina\'s Corrientes Province before shifting to its modern location farther west, scientists believe.'
        },
    ];

    let isLoggedIn, role;

    window.fetch = function (url, opts) {
        // for getting user info
        const authHeader = opts.headers['Authorization'];
        isLoggedIn = authHeader && authHeader.startsWith('Bearer ');
        // const roleString = isLoggedIn && authHeader.split(' ')[1];
        // role = roleString ? Role[roleString] : null;

        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(() => {

                signIn(url, opts, ok, error);
                signUp(url, opts, ok, error);
                refreshToken(url, opts, ok);
                getAllUsers(url, opts, ok, unauthorised);
                getNewsList(url, opts, ok, unauthorised);
                createNews(url, opts, ok, unauthorised);
                editPost(url, opts, ok, unauthorised);
                removeNews(url, opts, ok, unauthorised);
                getPostById(url, opts, ok, unauthorised);

                return ok(_users);

            }, 1000);

            function ok(body) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) })
            }

            function unauthorised() {
                resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorised' })) })
            }

            function error(message) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) })
            }
        });
    };

    const signIn = (url, opts, ok, error) => {
        if (url.endsWith(USER_AUTHENTICATE) && opts.method === 'POST') {
            let user;
            const params = JSON.parse(opts.body);
            const users = JSON.parse(localStorage.getItem('users'));

            if (users)
                user = users.find(user => user.email === params.email && user.password === params.password);
            else
                return error(`You're not registered! Sign Up to continue.`);

            if (!user) return error('Username or password is incorrect!');
            delete user.password;

            return ok(createToken(user));
        }
    };

    const refreshToken = (url, opts, ok) => {
        if (url.endsWith(USER_REFRESH_TOKEN) && opts.method === 'POST') {
            const params = JSON.parse(opts.body);
            const decoded = jwt.verify(params.token.refreshToken, SECRET_KEY);
            return ok(createToken(decoded.user));
        }
    }

    const createToken = (user) => {
        const accessToken = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: 10 });
        const refreshToken = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '1d' });
        return { accessToken, refreshToken };
    };

    const signUp = (url, opts, ok, error) => {
        if (url.endsWith(USER_AUTHORIZATION) && opts.method === 'POST') {
            const params = JSON.parse(opts.body);

            const user = {
                id: genUniqueID(),
                email: params.email,
                password: params.password,
                firstName: params.firstName,
                lastName: params.lastName,
                gender: params.gender,
                age: params.age,
                role: Role.User
            };

            if (!_users.find(user => user.email === params.email)) {
                _users.push(user);
            } else {
                return error(`User with the same E-mail already exist!`);
            }

            return ok(_users);
        }
    };

    const createNews = (url, opts, ok, unauthorised) => {
        if (url.endsWith('/news/add') && opts.method === 'POST') {
            if (!isLoggedIn) return unauthorised();
            const params = JSON.parse(opts.body);
            const news = {
                id: Math.floor(100 + Math.random() * (1000000 + 1 - 100)).toString(),
                title: params.title,
                description: params.description
            };
            _news.push(news);
            ok(_news);
        }
    };

    const editPost = (url, opts, ok, unauthorised) => {
        if (url.match(/\/news\/edit\/\d+$/) && opts.method === 'POST') {
            if (!isLoggedIn) return unauthorised();
            const params = JSON.parse(opts.body);
            const urlParts = url.split('/');
            const id = parseInt(urlParts[urlParts.length - 1]);
            let editedPost;
            _news.forEach((item, i) => {
                if (item.id === id.toString()) {
                    _news[i] = {
                        ...item,
                        title: params.title,
                        description: params.description
                    };
                    editedPost = item;

                }
            });
            ok(editedPost);
        }
    };

    const removeNews = (url, opts, ok, unauthorised) => {
        if (url.match(/\/news\/\d+$/) && opts.method === 'DELETE') {
            if (!isLoggedIn) return unauthorised();
            let urlParts = url.split('/');
            let id = parseInt(urlParts[urlParts.length - 1]);
            _news.forEach((item, i) => {
                if (item.id === id.toString()) {
                    _news.splice(i, 1);
                }
            });

            return ok(_news);
        }
    };

    const getPostById = (url, opts, ok, unauthorised) => {
        if (url.match(/\/news\/\d+$/) && opts.method === 'GET') {
            if (!isLoggedIn) return unauthorised();
            let urlParts = url.split('/');
            let id = parseInt(urlParts[urlParts.length - 1]);
            // get id from request url
            const post = _news.find(post => post.id === id.toString());

            return ok(post);
        }
    };

    // const getUserById = (url, opts, ok, unauthorised) => {
    //     if (url.match(/\/users\/\d+$/) && opts.method === 'GET') {
    //         if (!isLoggedIn) return unauthorised();
    //         let urlParts = url.split('/');
    //         let id = parseInt(urlParts[urlParts.length - 1]);

    //         // only allow normal users access to their own record
    //         if (role === Role.Admin) return unauthorised();

    //         const user = _users.find(user => user.id === id);
    //         return ok(user);
    //     }
    // };

    const getAllUsers = (url, opts, ok, unauthorised) => {
        if (url.endsWith('/users') && opts.method === 'GET') {
            //if (role !== Role.Admin) return unauthorised();
            return ok(_users);
        }
    };

    const getNewsList = (url, opts, ok, unauthorised) => {
        if (url.endsWith('/news') && opts.method === 'GET') {
            if (!isLoggedIn) return unauthorised();
            return ok(_news);
        }
    }

    const genUniqueID = () => {
        return `f${(~~(Math.random() * 1e8)).toString(32)}`;
    }
})();
