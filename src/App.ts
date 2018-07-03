import {Router, Request, Response, NextFunction} from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';

class App {

    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use((err:any, req: Request, res: Response, next: NextFunction) => {
            // development error handler
            if (this.express.get('env') === 'development') {
                console.log(req.baseUrl);
                res.status(err.status || 500);
                return res.json({
                    type: 'Error',
                    message: err.message,
                    error: err
                });
            }

            // production error handler
            res.status(err.status || 500);
            res.json({
                type: 'Error',
                message: err.message,
                error: {}
            });
        });

    }

    private routes(): void {

        let router = express.Router();
        this.express.use('/', router);

        router.get('/', HelloWorldController.get);
        this.express.use((req, res, next) => {
            console.log(req.baseUrl);
            let err: any = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }

}

export default new App().express;
