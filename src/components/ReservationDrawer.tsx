        {/* Payment Methods Logic */}
        <div className="space-y-4">
          {/* 1. Show Interac ONLY for Toronto */}
          {isToronto && (
            <div className="bg-[#ffcc00] p-4 rounded-2xl border-2 border-black/10">
               <p className="font-black text-[10px] tracking-widest mb-2">INTERAC e-TRANSFER (CANADA)</p>
               <p className="text-lg font-bold">rizzie052@gmail.com</p>
            </div>
          )}

          {/* 2. Show Cash App & Chime ONLY for Non-Toronto */}
          {!isToronto && (
            <>
              <div className="bg-white p-4 rounded-2xl border-2 border-green-500">
                <img src="/cashapp.png" className="w-48 mx-auto" alt="QR" />
                <p className="text-center font-bold text-2xl">$BradFlower</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <p className="font-bold text-gray-900">Chime: $Bradley-Flower</p>
              </div>
            </>
          )}
        </div>
