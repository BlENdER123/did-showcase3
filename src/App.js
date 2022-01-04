import React, {useState} from "react";
import {Account} from "@tonclient/appkit";
import {libWeb} from "@tonclient/lib-web";
import {signerKeys, TonClient, signerNone} from "@tonclient/core";

import {DidStorageContract} from "./new/DidStorageContractNew.js";
import {DidDocumentContract} from "./new/DidDocumentContractNew.js";

TonClient.useBinaryLibrary(libWeb);
const client = new TonClient({network: {endpoints: ["net.ton.dev"]}});

let dexrootAddr =
	"0:ee63d43c1f5ea924d3d47c5a264ad2661b5a4193963915d89f3116315350d7d3";

async function resolveDID(DID) {
	let tempDid = DID.split(":")[2];
	console.log(DID);

	const acc2 = new Account(DidStorageContract, {
		address: dexrootAddr,
		signer: signerNone(),
		client,
	});

	let res2;

	try {
		res2 = await acc2.runLocal("resolveDidDocument", {
			id: "0x" + tempDid,
		});
	} catch {
		console.log("Incorrect format DID");
		return;
	}

	console.log(res2);

	let addrDidDoc = res2.decoded.out_messages[0].value.addrDidDocument;

	try {
		const didAcc = new Account(DidDocumentContract, {
			address: addrDidDoc,
			signer: signerNone(),
			client,
		});

		const resDid = await didAcc.runLocal("getDid", {});

		console.log(resDid.decoded.out_messages[0].value.value0);
	} catch (e) {
		console.log(e);
		console.log(
			"Error! \n Possible reasons: \n - Wrong DID \n - This DID has been deleted",
		);
	}
}

function App() {
	return (
		<>
			{resolveDID(
				"did:everscale:f28b5fb95c2bfdc70b939de1ce2d79e1b8d233223596490827a91bc600fd876d",
			)}
		</>
	);
}

export default App;
