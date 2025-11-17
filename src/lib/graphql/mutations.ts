import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      message
      token
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      message
      token
    }
  }
`;

export const ENABLE_2FA_MUTATION = gql`
  mutation Enable2FA {
    enable2FA {
      secret
      qrCode
    }
  }
`;

export const VERIFY_2FA_MUTATION = gql`
  mutation Verify2FA($input: Verify2FAInput!) {
    verify2FA(input: $input) {
      message
    }
  }
`;

export const DISABLE_2FA_MUTATION = gql`
  mutation Disable2FA($input: Verify2FAInput!) {
    disable2FA(input: $input) {
      message
    }
  }
`;

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      stock
      imageUrl
      seller {
        id
        username
        email
      }
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      price
      stock
      imageUrl
      seller {
        id
        username
        email
      }
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      username
      role
      twoFactorEnabled
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      username
      role
      twoFactorEnabled
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation RemoveUser($id: String!) {
    removeUser(id: $id)
  }
`;

export const CREATE_UPLOAD_URL_MUTATION = gql`
  mutation CreateUploadUrl($input: CreateUploadUrlInput!) {
    createUploadUrl(input: $input) {
      uploadUrl
      token
      path
      publicUrl
    }
  }
`;
