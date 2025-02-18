import javax.swing.*;
import java.awt.event.*;
import kareltherobot.*;
public class Main implements Directions{
  public static void main(String[] args) {
    Robot fred = new Robot(2,2,East,16);
		//added more beepers,  so that robot doesn't run out
		//switched semicolons to commas
    World.setVisible(true);
		World.setSize(15, 15);
		World.setDelay(5);

		for(int i=0;i<5; i++)
			//changed "i=0" to "int i = 0"
			//Added semicolon between "i = 0" and "i<5"
		{
			fred.move();
			fred.putBeeper();
			//added semicolon to function
		}

		makeVertical(fred);

	turnRight(fred);

		for(int i=0; i<4; i++)
			//added int i
		{
			fred.move();
			fred.putBeeper();
		}
  
	}
	//added a bracket here

	public static void turnRight(Robot name)//changed fred to name so can be applicable to all robots regardless of name 
	{
		for(int i=0; i<3; i++)
			//fixed this for loop 
	
		{
			name.turnLeft();
			//changed from turnLeft(name); to name.turnLeft();
		}
		//added braacket
		}
		public static void makeVertical(Robot fred)//changed wilma to fred
			//fixed spelling to makeVertical
			{
				fred.turnLeft();
				for (int i=0; i<4; i++)
				{
					fred.move();
					fred.putBeeper();
				}
			}
}
