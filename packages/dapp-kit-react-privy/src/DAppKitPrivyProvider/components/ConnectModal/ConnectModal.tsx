"use client";

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useWalletModal } from "@vechain/dapp-kit-react";
import { TwitterLogo } from "../TwitterLogo";
import { GoogleLogo } from "../GoogleLogo";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  logo?: string;
};

export const ConnectModal = ({ isOpen, onClose, logo }: Props) => {
  const { login } = usePrivy();
  const { open } = useWalletModal();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 text-center"
                >
                  Log in or sign up
                </DialogTitle>

                <div className="mt-4 flex justify-center">
                  <img
                    src={logo || "/images/favicon.png"}
                    alt="logo"
                    className="max-w-[180px] max-h-[90px]"
                  />
                </div>

                <button
                  type="button"
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>

                <div className="mt-6">
                  <p className="text-sm text-gray-600 text-center">
                    Select a login method
                  </p>

                  <div className="mt-4 space-y-4">
                    <button
                      className="w-full flex items-center justify-center p-3 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={() => {
                        onClose();
                        login();
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <TwitterLogo isDark={false} />
                        <GoogleLogo />
                      </div>
                      <span>Continue with Social</span>
                    </button>
                    <button
                      className="w-full flex items-center justify-center p-3 text-sm text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        onClose();
                        open();
                      }}
                    >
                      <span>or with Crypto Wallet</span>
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
