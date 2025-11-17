import apolloClient from '@/lib/graphql/client';
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_BY_ID,
  GET_MY_PRODUCTS,
} from '@/lib/graphql/queries';
import {
  CREATE_PRODUCT_MUTATION,
  UPDATE_PRODUCT_MUTATION,
  DELETE_PRODUCT_MUTATION,
} from '@/lib/graphql/mutations';
import { Product, ProductFormData, ProductFilters, MessageResponse } from '@/types';

export const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  // GraphQL usa offset/limit en lugar de page/limit
  const { data } = await apolloClient.query({
    query: GET_ALL_PRODUCTS,
    variables: {
      pagination: {
        offset: 0,
        limit: 100, // Obtener muchos productos
      },
    },
    fetchPolicy: 'network-only',
  });

  let products = (data as any).products || [];

  // Aplicar filtros del lado del cliente si es necesario
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    products = products.filter((p: Product) =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower)
    );
  }

  if (filters?.minPrice) {
    products = products.filter((p: Product) => p.price >= filters.minPrice!);
  }

  if (filters?.maxPrice) {
    products = products.filter((p: Product) => p.price <= filters.maxPrice!);
  }

  if (filters?.sellerId) {
    products = products.filter((p: Product) => p.seller?.id === filters.sellerId);
  }

  return products;
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await apolloClient.query({
    query: GET_PRODUCT_BY_ID,
    variables: { term: id },
    fetchPolicy: 'network-only',
  });

  return (data as any).product;
};

export const getMyProducts = async (): Promise<Product[]> => {
  const { data } = await apolloClient.query({
    query: GET_MY_PRODUCTS,
    variables: {
      pagination: {
        offset: 0,
        limit: 100,
      },
    },
    fetchPolicy: 'network-only',
  });

  return (data as any).myProducts || [];
};

export const createProduct = async (data: ProductFormData): Promise<Product> => {
  const { data: result } = await apolloClient.mutate({
    mutation: CREATE_PRODUCT_MUTATION,
    variables: {
      input: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price.toString()),
        stock: parseInt(data.stock.toString(), 10),
        imageUrl: data.imageUrl,
      },
    },
  });

  return (result as any).createProduct;
};

export const updateProduct = async (
  id: string,
  data: Partial<ProductFormData>
): Promise<Product> => {
  try {
    const input: any = {};

    if (data.name !== undefined) input.name = data.name;
    if (data.description !== undefined) input.description = data.description;
    if (data.price !== undefined) input.price = parseFloat(data.price.toString());
    if (data.stock !== undefined) input.stock = parseInt(data.stock.toString(), 10);
    if (data.imageUrl !== undefined) input.imageUrl = data.imageUrl;

    console.log('🔄 [updateProduct] Updating product with:', { id, input });

    const { data: result } = await apolloClient.mutate({
      mutation: UPDATE_PRODUCT_MUTATION,
      variables: {
        id,
        input,
      },
    }) as { data: { updateProduct: Product } };

    console.log('✅ [updateProduct] Response:', result);

    if (!result || !result.updateProduct) {
      throw new Error('No se pudo actualizar el producto');
    }

    return result.updateProduct;
  } catch (error: any) {
    console.error('❌ [updateProduct] Error:', error);
    console.error('❌ [updateProduct] GraphQL Errors:', error?.graphQLErrors);
    console.error('❌ [updateProduct] Network Error:', error?.networkError);
    throw new Error(error?.graphQLErrors?.[0]?.message || error?.message || 'Error al actualizar producto');
  }
};

export const deleteProduct = async (id: string): Promise<MessageResponse> => {
  try {
    console.log('🗑️ [deleteProduct] Deleting product:', id);

    const { data: result } = await apolloClient.mutate({
      mutation: DELETE_PRODUCT_MUTATION,
      variables: { id },
    }) as { data: { deleteProduct: string } };

    console.log('✅ [deleteProduct] Response:', result);

    if (!result || !result.deleteProduct) {
      throw new Error('No se pudo eliminar el producto');
    }

    return { message: result.deleteProduct || 'Product deleted successfully' };
  } catch (error: any) {
    console.error('❌ [deleteProduct] Error:', error);
    console.error('❌ [deleteProduct] GraphQL Errors:', error?.graphQLErrors);
    throw new Error(error?.graphQLErrors?.[0]?.message || error?.message || 'Error al eliminar producto');
  }
};
