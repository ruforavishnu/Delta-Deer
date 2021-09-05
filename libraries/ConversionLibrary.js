console.log('loaded Conversion Library: true');

class ConversionLibrary
{
	static orthogonalToScreenCoords(point)//convert orthogonal world coordinate to screen inverted y manner coordinate
	{
		point.x = point.x;//x coordinate
		point.y = -1 * point.y;// inverse the y coordinate


		return point;
	}
}

