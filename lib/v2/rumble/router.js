module.exports = (router) => {
    router.get('/channel/:channel/:routeParams?', require('./channel'));
};
