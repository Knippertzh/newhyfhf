"use client";

import React from "react";
import Navbar from "@/components/navbar";

const AiToolsPage = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">AI Tools</h1>

        {/* AI Agents Section */}
        <div className="container mx-auto py-6 bg-[#282A37] rounded-lg">
          {/* Top Navigation */}
          <div className="flex justify-center space-x-2 mb-2">
            <div className="bg-[#3E4257] text-white rounded-full px-2 py-1 flex items-center text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 h-3 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M2 13.5C2 8.253 6.253 4 11.5 4h1a3.75 3.75 0 013.75 3.75v4.5c0 1.036.84 1.875 1.875 1.875H20a.75.75 0 010 1.5h-5.375a1.875 1.875 0 01-1.875 1.875v4.5A3.75 3.75 0 0112.5 20h-1A3.75 3.75 0 017.75 16.25v-4.5c0-1.036-.84-1.875-1.875-1.875H4a.75.75 0 010-1.5h5.375a1.875 1.875 0 011.875-1.875v-4.5A3.75 3.75 0 0111.5 4h1a3.75 3.75 0 013.75 3.75v4.5c0 1.036.84 1.875 1.875 1.875H20a.75.75 0 010 1.5h-5.375a1.875 1.875 0 01-1.875 1.875v4.5A3.75 3.75 0 0112.5 20h-1A3.75 3.75 0 017.75 16.25v-4.5c0-1.036-.84-1.875-1.875-1.875H4a.75.75 0 010-1.5h5.375a1.875 1.875 0 011.875-1.875v-4.5A3.75 3.75 0 0111.5 4z"
                  clipRule="evenodd"
                />
              </svg>
              Smart Home
            </div>
            <div className="bg-[#3E4257] text-gray-400 rounded-full px-2 py-1 flex items-center text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 h-3 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M2 13.5C2 8.253 6.253 4 11.5 4h1a3.75 3.75 0 013.75 3.75v4.5c0 1.036.84 1.875 1.875 1.875H20a.75.75 0 010 1.5h-5.375a1.875 1.875 0 01-1.875 1.875v4.5A3.75 3.75 0 0112.5 20h-1A3.75 3.75 0 017.75 16.25v-4.5c0-1.036-.84-1.875-1.875-1.875H4a.75.75 0 010-1.5h5.375a1.875 1.875 0 011.875-1.875v-4.5A3.75 3.75 0 0111.5 4h1a3.75 3.75 0 013.75 3.75v4.5c0 1.036.84 1.875 1.875 1.875H20a.75.75 0 010 1.5h-5.375a1.875 1.875 0 01-1.875 1.875v4.5A3.75 3.75 0 0112.5 20h-1A3.75 3.75 0 017.75 16.25v-4.5c0-1.036-.84-1.875-1.875-1.875H4a.75.75 0 010-1.5h5.375a1.875 1.875 0 011.875-1.875v-4.5A3.75 3.75 0 0111.5 4z"
                  clipRule="evenodd"
                />
              </svg>
              Calendar
            </div>
            <div className="bg-[#3E4257] text-gray-400 rounded-full px-2 py-1 flex items-center text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 h-3 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M2 13.5C2 8.253 6.253 4 11.5 4h1a3.75 3.75 0 013.75 3.75v4.5c0 1.036.84 1.875 1.875 1.875H20a.75.75 0 010 1.5h-5.375a1.875 1.875 0 01-1.875 1.875v4.5A3.75 3.75 0 0112.5 20h-1A3.75 3.75 0 017.75 16.25v-4.5c0-1.036-.84-1.875-1.875-1.875H4a.75.75 0 010-1.5h5.375a1.875 1.875 0 011.875-1.875v-4.5A3.75 3.75 0 0111.5 4h1a3.75 3.75 0 013.75 3.75v4.5c0 1.036.84 1.875 1.875 1.875H20a.75.75 0 010 1.5h-5.375a1.875 1.875 0 01-1.875 1.875v4.5A3.75 3.75 0 0112.5 20h-1A3.75 3.75 0 017.75 16.25v-4.5c0-1.036-.84-1.875-1.875-1.875H4a.75.75 0 010-1.5h5.375a1.875 1.875 0 011.875-1.875v-4.5A3.75 3.75 0 0111.5 4h1a3.75 3.75 0 013.75 3.75v4.5c0 1.036.84 1.875 1.875 1.875H20a.75.75 0 010 1.5h-5.375a1.875 1.875 0 01-1.875 1.875v4.5A3.75 3.75 0 0112.5 20h-1A3.75 3.75 0 017.75 16.25v-4.5c0-1.036-.84-1.875-1.875-1.875H4a.75.75 0 010-1.5h5.375a1.875 1.875 0 011.875-1.875v-4.5A3.75 3.75 0 0111.5 4z"
                  clipRule="evenodd"
                />
              </svg>
              Todo
            </div>
            <div className="bg-[#3E4257] text-gray-400 rounded-full px-2 py-1 flex items-center text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 h-3 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M2 13.5C2 8.253 6.253 4 11.5 4h1a3.75 3.75 0 013.75 3.75v4.5c0 1.036.84 1.875 1.875 1.875H20a.75.75 0 010 1.5h-5.375a1.875 1.875 0 01-1.875 1.875v4.5A3.75 3.75 0 0112.5 20h-1A3.75 3.75 0 017.75 16.25v-4.5c0-1.036-.84-1.875-1.875-1.875H4a.75.75 0 010-1.5h5.375a1.875 1.875 0 011.875-1.875v-4.5A3.75 3.75 0 0111.5 4h1a3.75 3.75 0 013.75 3.75v4.5c0 1.036.84 1.875 1.875 1.875H20a.75.75 0 010 1.5h-5.375a1.875 1.875 0 01-1.875 1.875v4.5A3.75 3.75 0 0112.5 20h-1A3.75 3.75 0 017.75 16.25v-4.5c0-1.036-.84-1.875-1.875-1.875H4a.75.75 0 010-1.5h5.375a1.875 1.875 0 011.875-1.875v-4.5A3.75 3.75 0 0111.5 4z"
                  clipRule="evenodd"
                />
              </svg>
              Expenses
            </div>
            <div className="bg-[#3E4257] text-gray-400 rounded-full px-2 py-1 flex items-center text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 h-3 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M2 13.5C2 8.253 6.253 4 11.5 4h1a3.75 3.75 0 013.75 3.75v4.5c0 1.036.84 1.875 1.875 1.875H20a.75.75 0 010 1.5h-5.375a1.875 1.875 0 01-1.875 1.875v4.5A3.75 3.75 0 0112.5 20h-1A3.75 3.75 0 017.75 16.25v-4.5c0-1.036-.84-1.875-1.875-1.875H4a.75.75 0 010-1.5h5.375a1.875 1.875 0 011.875-1.875v-4.5A3.75 3.75 0 0111.5 4h1a3.75 3.75 0 013.75 3.75v4.5c0 1.036.84 1.875 1.875 1.875H20a.75.75 0 010 1.5h-5.375a1.875 1.875 0 01-1.875 1.875v4.5A3.75 3.75 0 0112.5 20h-1A3.75 3.75 0 017.75 16.25v-4.5c0-1.036-.84-1.875-1.875-1.875H4a.75.75 0 010-1.5h5.375a1.875 1.875 0 011.875-1.875v-4.5A3.75 3.75 0 0111.5 4z"
                  clipRule="evenodd"
                />
              </svg>
              Meals
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 mr-2 text-[#90EE90]"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.732c1.155 2 .179 4.5-2.599 4.5H4.645c-2.778 0-3.754-2.5-2.599-4.5L9.401 3.003zM12 10a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5z"
                clipRule="evenodd"
              />
            </svg>
            Air Conditioning
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Temperature Display */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src="https://via.placeholder.com/150x150/44475a/90EE90?text=22°C"
                alt="Temperature"
                className="mx-auto rounded-full border-2 border-[#90EE90]"
              />
            </div>

            {/* Stats */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-[#3E4257] rounded-md p-3 text-white">
                <p className="text-sm text-gray-400">Current Consumption</p>
                <p className="text-lg font-semibold">1.1 KW</p>
              </div>
              <div className="bg-[#3E4257] rounded-md p-3 text-white">
                <p className="text-sm text-gray-400">Humidity</p>
                <p className="text-lg font-semibold">50.2%</p>
              </div>
              <div className="bg-[#3E4257] rounded-md p-3 text-white">
                <p className="text-sm text-gray-400">Temperature</p>
                <p className="text-lg font-semibold">16 °C</p>
              </div>
            </div>
          </div>

          {/* Camera Section */}
          <div className="flex-1">
            <div className="bg-[#3E4257] rounded-md p-3 text-white">
              <p className="text-sm text-gray-400">Camera</p>
              <img
                src="https://via.placeholder.com/150x100/44475a/90EE90?text=Live"
                alt="Camera"
                className="mx-auto rounded-md"
              />
            </div>
          </div>

          {/* Indonesia Section */}
          <div className="flex-1">
            <div className="bg-[#3E4257] rounded-md p-3 text-white">
              <p className="text-sm text-gray-400">Indonesia</p>
              <p className="text-lg font-semibold">28 °C</p>
              <p className="text-sm text-gray-400">Sunny with cold</p>
            </div>
          </div>

          {/* Devices Section */}
          <div className="flex-1">
            <div className="bg-[#3E4257] rounded-md p-3 text-white">
              <p className="text-sm text-gray-400">Devices</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-[#90EE90]"
                  >
                    <path d="M12 18a6 6 0 110-12 6 6 0 010 12zM12 20a8 8 0 100-16 8 8 0 000 16zm0-18a10 10 0 110 20 10 10 0 010-20z" />
                  </svg>
                  <span>Light</span>
                  <img
                    src="https://via.placeholder.com/20x10/90EE90/000000?text=On"
                    alt="Light On"
                    className="rounded-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-[#90EE90]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.953 6.32A6.75 6.75 0 0117.257 4.15a6.75 6.75 0 016.172 10.002c-.221 1.272-.92 2.417-1.947 3.326a6.723 6.723 0 01-3.207 1.25l-.283.042a18.75 18.75 0 00-7.122-2.242l-.283-.042a6.75 6.75 0 01-2.694-2.095 6.75 6.75 0 01-.543-6.012zm1.591 1.828a.75.75 0 00-1.213-.883l-1.296 2.245a.75.75 0 00.362.979l3.178 1.059a.75.75 0 00.979-.362l2.245-1.296a.75.75 0 00-.883-1.213H6.544zM15.75 12a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Router</span>
                  <img
                    src="https://via.placeholder.com/20x10/90EE90/000000?text=On"
                    alt="Router On"
                    className="rounded-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-white"
                  >
                    <path d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3V12.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-2.25 0a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm4.5 0a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z" />
                  </svg>
                  <span>Smart TV</span>
                  <img
                    src="https://via.placeholder.com/20x10/808080/000000?text=Off"
                    alt="Smart TV Off"
                    className="rounded-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-[#90EE90]"
                  >
                    <path d="M11.47 3.84a1.5 1.5 0 00-2.94 0 6.03 6.03 0 00-5.091 5.091 1.5 1.5 0 000 2.94 6.03 6.03 0 005.091 5.091 1.5 1.5 0 002.94 0 6.03 6.03 0 005.091-5.091 1.5 1.5 0 000-2.94 6.03 6.03 0 00-5.091-5.091zM12 12a3 3 0 100-6 3 3 0 000 6zM3.75 15.75a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" />
                  </svg>
                  <span>Speaker</span>
                  <img
                    src="https://via.placeholder.com/20x10/90EE90/000000?text=On"
                    alt="Speaker On"
                    className="rounded-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-white"
                  >
                    <path d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3V12.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-2.25 0a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm4.5 0a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z" />
                  </svg>
                  <span>Humidifier</span>
                  <img
                    src="https://via.placeholder.com/20x10/808080/000000?text=Off"
                    alt="Humidifier Off"
                    className="rounded-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-[#90EE90]"
                  >
                    <path d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3V12.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-2.25 0a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm4.5 0a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z" />
                  </svg>
                  <span>CCTV</span>
                  <img
                    src="https://via.placeholder.com/20x10/90EE90/000000?text=On"
                    alt="CCTV On"
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiToolsPage;
