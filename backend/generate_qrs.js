const QRCode = require('qrcode');

const codes = [
    { typeName: 'Organic Waste', data: { type: 2, weight: 2.5, binId: 1, typeName: 'Organic Waste' }, file: '../demo-qr-organic.png' },
    { typeName: 'Plastic Bottles', data: { type: 5, weight: 1.2, binId: 2, typeName: 'Plastic Bottles' }, file: '../demo-qr-plastic.png' },
    { typeName: 'E-Waste', data: { type: 15, weight: 0.8, binId: 3, typeName: 'E-Waste' }, file: '../demo-qr-ewaste.png' }
];

codes.forEach(async c => {
    try {
        await QRCode.toFile(c.file, JSON.stringify(c.data), {
            color: { dark: '#000000', light: '#ffffff' },
            width: 400,
            margin: 2
        });
        console.log(`Generated ${c.file}`);
    } catch(e) {
        console.error(e);
    }
});
