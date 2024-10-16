# Auth Server 

A simple JWT auth server that signs and verifies tokens for users.

## TTFHW

1. Clone the repository:
```bash
git clone https://github.com/hallstrom91/fwk4-23-auth.git
```

2. Enter cloned repository directory:
```bash
cd fwk4-23-auth
```

3. Install required packages:
```bash 
npm install
```

4. Create .env or .env.development.local in the root folder of project:
```bash
JWT_SECRET=
PORT=
```
5. Start the auth server:
```bash
npm run dev
```

## Testing with Insomnia or Postman

### Sign JWT Route

1. Add JSON object to request body:
```REQUESTBODY
{
  "userId": "12345",
  "email": "user@example.com",
  "role": "admin"
}
```
2. Send **POST** request to: `localhost:3000/token/sign`
   
`Success`
```RESPONSEBODY200
{
"token": "CREATED-AND-SIGNED-TOKEN"
}
```

`Invalid payload`
```RESPONSEBODY400
{
	"error": "Invalid payload"
}
```



### Verify JWT Route
1. Collect returned token from response and add it to request body.
  
2. Add JSON object to request body:
```REQUESTBODY
{
  "token": "ADD-JWT-TOKEN-HERE"
}
```
3. Send **POST** request to: `localhost:3000/token/verify` 

`Success`
```RESPONSEBODY200
{
	"message": "Token is valid",
	"decoded": {
		"userId": "12345",
		"email": "user@example.com",
		"role": "admin",
		"iat": 1729084114,
		"exp": 1729087714
	}
}
```

`Invalid or expired`
```RESPSONEBODY401
{
	"error": "Invalid or expired token"
}
```

`Missing`
```RESPONSEBODY400
{
	"error": "Token missing"
}
```
