import { gql } from '@apollo/client';

// Products queries
export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($pagination: PaginationInput) {
    products(pagination: $pagination) {
      id
      name
      description
      price
      stock
      seller {
        id
        username
        email
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($term: String!) {
    product(term: $term) {
      id
      name
      description
      price
      stock
      seller {
        id
        username
        email
      }
    }
  }
`;

export const GET_MY_PRODUCTS = gql`
  query GetMyProducts($pagination: PaginationInput) {
    myProducts(pagination: $pagination) {
      id
      name
      description
      price
      stock
    }
  }
`;

export const GET_SELLERS = gql`
  query GetSellers($pagination: PaginationInput) {
    sellers(pagination: $pagination) {
      id
      username
      email
      products {
        id
        name
        price
        stock
      }
      productsCount
    }
  }
`;

export const GET_SELLER_PROFILE = gql`
  query GetSellerProfile($id: ID!) {
    sellerProfile(id: $id) {
      seller {
        id
        username
        twoFactorEnabled
      }
      products {
        id
        name
        description
        price
        stock
      }
      salesHistory {
        id
        status
        createdAt
        items {
          orderItemId
          productId
          productName
          quantity
          itemPrice
        }
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers($pagination: PaginationInput) {
    users(pagination: $pagination) {
      id
      email
      username
      role
      twoFactorEnabled
    }
  }
`;

export const GET_USER = gql`
  query GetUser($term: String!) {
    user(term: $term) {
      id
      email
      username
      role
      twoFactorEnabled
      products {
        id
        name
        price
        stock
      }
    }
  }
`;
