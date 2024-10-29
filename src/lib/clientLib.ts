import tokenizar from "@/lib/tokenizar.txt";
import user from "@/lib/user.txt";
import TOKENIZAR_ABI from "@/lib/contracts/Tokenizar.json";
import USER_ABI from "@/lib/contracts/UserContract.json";

export function getDeployedTo(contract: string): {ADDRESS: string , ABI: object}  {
    if (contract === "tokenizarContract") {
        const deployedToMatch = tokenizar.match(/Deployed to: (0x[a-fA-F0-9]{40})/);
        return {ADDRESS: deployedToMatch ? deployedToMatch[1] : null, ABI: TOKENIZAR_ABI};
    }
    if (contract === "userContract") {
        const deployedToMatch = user.match(/Deployed to: (0x[a-fA-F0-9]{40})/);
        return {ADDRESS: deployedToMatch ? deployedToMatch[1] : null, ABI: USER_ABI};
    }
    return {ADDRESS: "contract not found", ABI: {}};
}
