import { Detailed } from "@/types";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/detaileds`;

const getDetaileds = async (): Promise<Detailed[]> => {
  const res = await fetch(URL);

  return res.json();
};

export default getDetaileds;
