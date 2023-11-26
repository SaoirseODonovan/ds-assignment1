## ServerlessREST Assignment - Distributed Systems.

__Name:__ Saoirse O'Donovan

This repository contains the implementation of a serverless REST API for the AWS platform. A CDK stack creates the infrastructure. The domain context of the API is movie reviews.

### API endpoints.

[Provide a bullet-point list of the app's endpoints (excluding the Auth API endpoints).]
e.g.
 
+ POST /movies/reviews - add a movie review.
+ GET /movies/{movieId}/reviews - Get all the reviews for a movie with the specified id.
+ GET /movies/{movieId}/reviews?minRating=n - Get all the reviews for the movie with the specified ID with a rating greater than the minRating.
+ GET /movies/{movieId}/reviews/{reviewerName} - Get the review for the movie with the specified movie ID and written by the named reviewer.
+ PUT /movies/{movieId}/reviews/{reviewerName} - Update the text of a review. (movie ID and reviewer username uniquely identify a review item).
+ GET /movies/{movieId}/reviews/{year} - Get the review(s) for the movie with the specified movie ID and were written in a specified year.
+ GET /movies/reviews/{reviewerName} - Get all the reviews written by a specific reviewer.

[There are some additional endpoints for the Auth API.]

+ POST /auth/signup - Sign up with username, password and email.
+ POST /auth/confirm_signup - Verify sign up with code sent to email.
+ POST /auth/signin - Authenticate with Cookie using token as the value.

[Include screenshots from the AWS console (API Gateway service) that clearly show the deployed API ( have legible font size). ]
![](./images/image2-ds.png)

[Auth Service API]
![](./images/image3-ds.png)

[Rest API]
![](./images/image4-ds.png)
![](./images/image5-ds.png)


### Authentication..

[Include a screenshot from the AWS console (Cognito User Pools) showing a confirmed user account.]
![](./images/image1-ds.png)

### To run..
+ Run 'npm install' to begin
+ Next run 'npm run schema'
+ Finally, run 'cdk deploy'
+ When finished, run 'cdk destroy' to clean up everything


### Independent learning (If relevant).

[ Briefly explain any aspects of your submission that required independent research and learning, i.e. not covered in the lectures/labs. State the files that have evidence of this.]



State any other evidence of independent learning achieved while completing this assignment.