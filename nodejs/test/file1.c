#include "file1.h"

// not a doxygen comment
void toggleLed()
{
    //stuff
}

/// everyone loves a good blinking LED
void blinky()
{
    toggleLed();
    delayMs(100);
    toggleLed();
}

/** 
 * @brief This will block for some time.
 */
void delayMs(unsigned char ms)
{
    //stuff
}

