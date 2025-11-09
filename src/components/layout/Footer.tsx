'use client';

import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Campus Food Sharing
            </h3>
            <p className="text-gray-600 text-sm">
              Plataforma para compartir comida entre estudiantes universitarios.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Enlaces
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-600 hover:text-primary-600">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-600 hover:text-primary-600">
                  Órdenes
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-600 hover:text-primary-600">
                  Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Contacto
            </h3>
            <p className="text-gray-600 text-sm">
              {/* TODO: Add contact information */}
              Email: info@cfs.com
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-300 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} Campus Food Sharing. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
