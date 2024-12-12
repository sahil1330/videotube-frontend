export default function geterrorMessage(errorData: string): string {
    const preRegex = /<pre>(.*?)<\/pre>/s;
    const match = preRegex.exec(errorData);
    const errorMessage = match ? match[1] : "An error occurred";
    return errorMessage;
}