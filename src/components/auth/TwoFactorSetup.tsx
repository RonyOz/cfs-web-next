/**
 * TwoFactorSetup Component - OPTIONAL :d
 * 
 * TODO: Implement 2FA enable/disable logic
 * TODO: Display QR code using qrcode.react
 * TODO: Add token verification
 * TODO: Show success/error messages properly (no window.alert!)
 */

'use client';

import { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';

export const TwoFactorSetup = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  // TODO: Get user's 2FA status from auth store
  const twoFactorEnabled = false; // Replace with actual value

  // TODO: Implement enable 2FA handler
  const handleEnable2FA = async () => {
    // TODO: Call enable2FA API
    // const response = await enable2FA();
    // setQrCode(response.qrCode);
    // setSecret(response.secret);
    // setIsModalOpen(true);
  };

  // TODO: Implement verify 2FA handler
  const handleVerify2FA = async () => {
    // TODO: Call verify2FA API with verification code
    // const response = await verify2FA({ token: verificationCode });
    // Show success message
    // Update user state
    // setIsModalOpen(false);
  };

  // TODO: Implement disable 2FA handler
  const handleDisable2FA = async () => {
    // TODO: Call disable2FA API
    // const response = await disable2FA();
    // Show success message
    // Update user state
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900">
            Autenticación de Dos Factores
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {twoFactorEnabled
              ? 'La autenticación de dos factores está habilitada'
              : 'Agrega una capa extra de seguridad a tu cuenta'}
          </p>
        </div>

        {twoFactorEnabled ? (
          <Button variant="danger" onClick={handleDisable2FA}>
            Deshabilitar
          </Button>
        ) : (
          <Button variant="primary" onClick={handleEnable2FA}>
            Habilitar
          </Button>
        )}
      </div>

      {/* 2FA Setup Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Configurar Autenticación de Dos Factores"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Escanea este código QR con tu aplicación de autenticación (Google Authenticator, Authy, etc.)
          </p>

          {/* TODO: Display QR code */}
          <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
            {qrCode ? (
              <img src={qrCode} alt="QR Code" className="w-48 h-48" />
            ) : (
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">QR Code</p>
              </div>
            )}
          </div>

          {/* Secret key (manual entry) */}
          {secret && (
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">O ingresa este código manualmente:</p>
              <code className="text-sm font-mono">{secret}</code>
            </div>
          )}

          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
              <p className="text-sm text-danger-700">{error}</p>
            </div>
          )}

          <Input
            label="Código de Verificación"
            type="text"
            placeholder="123456"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleVerify2FA}
            disabled={verificationCode.length !== 6}
          >
            Verificar y Activar
          </Button>
        </div>
      </Modal>
    </div>
  );
};
