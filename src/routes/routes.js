const express = require('express');
import userRoutes from './employeeRoute'

export default (server) => {
    // define all models route here
    server.use('/api/users', userRoutes);
}