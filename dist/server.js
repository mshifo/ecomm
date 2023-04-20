"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const config_1 = __importDefault(require("./helpers/config"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false })); //
app.use(express_1.default.json()); //
app.use((0, cors_1.default)());
app.use('/admin/users', users_1.default);
app.use('/api/auth', auth_1.default);
app.get('/', (req, res) => {
    res.send('Well done!');
});
const PORT = config_1.default.port || 3000;
if (config_1.default.environment !== 'test') {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}
exports.default = app;
