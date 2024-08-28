import { type Request, type Response } from 'express'
import authorization from '~/app/middleware/authorization'
import OpenStreetMapService from '~/app/service/provider/osm.service'
import HttpResponse from '~/core/modules/response/HttpResponse'
import { asyncHandler } from '~/core/utils/asyncHandler'
import v1Route from '~/routes/v1'

const route = v1Route
const routePath = `/open-street-map`
const newOSMService = new OpenStreetMapService()

route.get(
  `${routePath}/by-address`,
  authorization,
  asyncHandler(async function getAddress(req: Request, res: Response) {
    const { q: address } = req.getQuery()

    const data = await newOSMService.getByAddress(address)

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

route.get(
  `${routePath}/by-coordinate`,
  authorization,
  asyncHandler(async function getCoordinate(req: Request, res: Response) {
    const { latitude, longitude } = req.getQuery()

    const data = await newOSMService.getByCoordinate(latitude, longitude)

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)
