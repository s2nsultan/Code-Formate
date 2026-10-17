#include <iostream>
using namespace std;

int main() {
    int number;
    cout << "Enter a number: ";
    if (!(cin >> number)) {
        return 1;
    }

    for (int i = 1; i <= 10; i++) {
        cout << number << " x " << i << " = " << number * i << endl;
    }

    return 0;
}