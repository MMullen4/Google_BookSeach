import type { Request } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import { GraphQLError } from 'graphql';
import { error } from 'console';
dotenv.config();

interface UserPayload {
  username: string;
  email: string;
  password: string;
}
interface JwtPayload {
 data: UserPayload;
}

interface AuthRequest extends Request {
  user: UserPayload;
  body: {
    token?: string;
  };
  query: {
    token?: string;
  };
  headers: {
    authorization?: string;
  };
}
  
const secret: string = 'mysecretsshhhhh';
const expiration: string = '2h';

export const AuthenticationError = new GraphQLError('Could not authenticate user.', {
  extensions: {
    code: 'UNAUTHENTICATED',
  },
});

export const authMiddleware = function ({ req }: { req: AuthRequest }): AuthRequest {
  // allow token to be sent via req.query or headers
  let token = req.body.token || req.query.token || req.headers.authorization;

  // check if there's an authorization header in the request, and extracts token from the header
  if (req.headers.authorization) {
    token = (token || "").split(" ").pop()?.trim() || "";
  }

  // if no token, return request obj as is
  if (!token) {
    return req;
  }

  try {
    const { data } = jwt.verify(token, secret, {
      maxAge: expiration,
    }) as JwtPayload;
    req.user = data;
  } catch {
    console.log("Invalid token", token, error);
  }

  return req;
};

// export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(' ')[1];

//     const secretKey = process.env.JWT_SECRET_KEY || '';

//     jwt.verify(token, secretKey, (err, user) => {
//       if (err) {
//         return res.sendStatus(403); // Forbidden
//       }

//       req.user = user as JwtPayload;
//       return next();
//     });
//   } else {
//     res.sendStatus(401); // Unauthorized
//   }
// };

interface UserPayload {
  username: string;
  email: string;
  password: string;
  _id: string; // Add the _id property
}

export const signToken = function ({ username, email, _id }: UserPayload): string {
  try {
    const payload = { username, email, _id };
    const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration } as jwt.SignOptions);
    console.log('Generated token:', token);
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};
