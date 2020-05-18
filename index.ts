const DEFAULT_BYTE_LENGTH: number = 8;
enum Encoding {
	unicode8='utf-8',
	unicode16='utf-16',
	ascii='ascii',
};

// https://tools.ietf.org/html/rfc3074
const seedTable = new Uint8Array([
	251, 175, 119, 215, 81, 14, 79, 191, 103, 49, 181, 143, 186, 157, 0,
	232, 31, 32, 55, 60, 152, 58, 17, 237, 174, 70, 160, 144, 220, 90, 57,
	223, 59,  3, 18, 140, 111, 166, 203, 196, 134, 243, 124, 95, 222, 179,
	197, 65, 180, 48, 36, 15, 107, 46, 233, 130, 165, 30, 123, 161, 209, 23,
	97, 16, 40, 91, 219, 61, 100, 10, 210, 109, 250, 127, 22, 138, 29, 108,
	244, 67, 207,  9, 178, 204, 74, 98, 126, 249, 167, 116, 34, 77, 193,
	200, 121,  5, 20, 113, 71, 35, 128, 13, 182, 94, 25, 226, 227, 199, 75,
	27, 41, 245, 230, 224, 43, 225, 177, 26, 155, 150, 212, 142, 218, 115,
	241, 73, 88, 105, 39, 114, 62, 255, 192, 201, 145, 214, 168, 158, 221,
	148, 154, 122, 12, 84, 82, 163, 44, 139, 228, 236, 205, 242, 217, 11,
	187, 146, 159, 64, 86, 239, 195, 42, 106, 198, 118, 112, 184, 172, 87,
	2, 173, 117, 176, 229, 247, 253, 137, 185, 99, 164, 102, 147, 45, 66,
	231, 52, 141, 211, 194, 206, 246, 238, 56, 110, 78, 248, 63, 240, 189,
	93, 92, 51, 53, 183, 19, 171, 72, 50, 33, 104, 101, 69, 8, 252, 83, 120,
	76, 135, 85, 54, 202, 125, 188, 213, 96, 235, 136, 208, 162, 129, 190,
	132, 156, 38, 47, 1, 7, 254, 24, 4, 216, 131, 89, 21, 28, 133, 37, 153,
	149, 80, 170, 68, 6, 169, 234, 151
]);

function stringToByteArray(str: string, encoding: Encoding): Uint8Array|Uint16Array {
	switch (encoding) {
		case Encoding.unicode8:
			const encoder = new TextEncoder(); // defaults to 'utf-8' or 'utf8'
			return encoder.encode(str);
		case Encoding.unicode16:
			return Uint16Array.from(str.split("").map(c => c.charCodeAt(0)));
		case Encoding.ascii:
			return Uint8Array.from(str.split("").map(c => c.charCodeAt(0)));
		default:
			return new Uint8Array();
	}
}

function pearson(message: string, encoding: Encoding = Encoding.unicode8): string {
	const data = stringToByteArray(message, encoding);
	let hash = data.byteLength > DEFAULT_BYTE_LENGTH ? new Uint16Array(data.byteLength)
		: new Uint8Array(data.byteLength);
	for (let j = 0; j < hash.byteLength; j++) {
		let h = seedTable[(data[0] + j) % 256];
		for (let i = 1; i < data.length; i++){
			h = seedTable[(h ^ data[i])];
		}
		hash[j] = h;
	}

	let hashedString: string = "";
	for (let charCode of hash) {
		hashedString += String.fromCharCode(charCode);
	}

	return hashedString;
}

/*
 * console.log(pearson('hello world', Encoding.unicode8));
 * console.log(pearson('[]]', Encoding.unicode16));
 * console.log(pearson('&&', Encoding.ascii));
 */
