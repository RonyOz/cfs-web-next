'use client';

import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-800 border-t border-dark-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">
              Campus Food Sharing
            </h3>
            <p className="text-gray-400 text-sm">
              Plataforma para compartir comida entre estudiantes universitarios.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">
              Enlaces
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-primary-400">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-400 hover:text-primary-400">
                  Órdenes
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-primary-400">
                  Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">
              Contacto
            </h3>
            <p className="text-gray-400 text-sm">
              {/* TODO: Add contact information */}
              Email: info@cfs.com
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dark-700 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Campus Food Sharing. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
