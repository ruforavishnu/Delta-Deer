class Conversion
{
	static orthogonalToScreenCoords(point)//convert orthogonal world coordinate to screen inverted y manner coordinate
	{
		point[0] = point[0];//x coordinate
		point[1] = -1 * point[1] // inverse the y coordinate

		return point;
	}
}