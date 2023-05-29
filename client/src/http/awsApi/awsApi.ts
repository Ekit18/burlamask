import { $awsHost } from "..";

export const searchAwsImg = async (description: string) => {
    const { data } = await $awsHost.post(`faceswap-aws/search`, { query: description });
    return data.result;
}
