// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { isObject, get } from 'lodash';
import yup from 'yup';
import fs from 'fs';
import Sequelize from 'sequelize';
// import models from '../models'

// const { sequelize } = models

class ResponseError extends Error {
  statusCode: any;

  constructor(message: any, statusCode = 500) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}

// async function createTransaction(req: any) {
//   const transaction = await sequelize.transaction({
//     isolationLevel: 'SERIALIZABLE',
//   })

//   req.transaction = transaction
//   req.transaction.manualCommit = async () => {
//     delete req.transaction
//     await transaction.commit()
//   }

//   req.transaction.manualRollback = async () => {
//     delete req.transaction
//     await transaction.rollback()
//   }
//   return req.transaction
// }

function cleanMulterFiles(req: any) {
  const { rawUploadedFiles } = req;
  if (rawUploadedFiles) {
    const entriesFiles = Object.entries(rawUploadedFiles);
    for (let i = 0; i < entriesFiles.length; i += 1) {
      // eslint-disable-next-line no-unused-vars
      const [field, value]: any = entriesFiles[i];
      console.log('Removing... ', value.path);
      fs.unlinkSync(value.path);
    }
  }
}

function generateErrorResponseError(e: any) {
  return isObject(e.message) ? e.message : { message: e.message };
}

function generateErrorYup(e: any) {
  return {
    message: e.errors.join('<br/>'),
    errors:
      e.inner.length > 0
        ? e.inner.reduce((acc: any, curVal: any) => {
            acc[curVal.path] = curVal.message;
            return acc;
          }, {})
        : { [e.path]: e.message },
  };
}

function generateErrorSequelize(e: any) {
  const errors = get(e, 'errors', []);
  const errorMessage = get(errors, '0.message', null);
  return {
    message: errorMessage ? `Validation error: ${errorMessage}` : e.message,
    errors: errors.reduce((acc: any, curVal: any) => {
      acc[curVal.path] = curVal.message;
      return acc;
    }, {}),
  };
}

const wrapperRequest = (fn: any) => {
  return async (req: Request, res: Response) => {
    try {
      const data = await fn({
        req,
        ResponseError,
      });

      return res.status(200).json(isObject(data) ? data : { data });
    } catch (e) {
      cleanMulterFiles(req);

      if (e instanceof ResponseError) {
        console.log('ERROR RESPONSE ERROR!!!');
        return res.status(e.statusCode).json(generateErrorResponseError(e));
      }

      if (e instanceof yup.ValidationError) {
        console.log('ERROR YUP VALIDATION!!!');
        return res.status(400).json(generateErrorYup(e));
      }

      if (e instanceof Sequelize.ValidationError) {
        console.log('ERROR SEQUELIZE VALIDATION!!!');
        return res.status(400).json(generateErrorSequelize(e));
      }
      console.log(e);

      /*
			 lebih logic return status code 500 karena error memang tidak dihandle
			 dicontroller
			 */
      return res.status(500).json({ message: e.message });
    }
  };
};

export default wrapperRequest;
