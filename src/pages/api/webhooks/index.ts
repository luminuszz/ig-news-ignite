import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {

    console.log('event')

    return res.status(200).json({ test: true })

}