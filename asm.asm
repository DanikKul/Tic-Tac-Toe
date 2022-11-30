#include <iostream>

using namespace std;

int main() {

    setlocale(LC_ALL, "Rus");
    double mas[10], res[10];
    cout << "Введите 10 членов исходного массива" << endl;

    for (int i = 0; i < 10; i++) {
        cout << "mas[" << i << "] = ";
        cin >> mas[i];
        if (cin.fail()) {
            i--;
            cin.clear();
            cin.ignore();
        }
    }

    int mas_size = 10 * sizeof(double);
    int double_size = sizeof(double);

    _asm {
        xor esi, esi
        xor ebx, ebx
        cycle1:
        fld mas[esi]
        mov ebx, esi
        cycle2:
            cmp esi, 0
            je skip
            sub esi, double_size
            fadd mas[esi]
            cmp esi, 0
            jne cycle2
        skip:
        mov esi, ebx
        fstp res[esi]
        add esi, double_size
        cmp mas_size, esi
        jne cycle1
    }

    cout << endl << "Итоговый массив" << endl;
    for (int i = 0; i < 10; i++) {
        cout << res[i] << endl;
    }

    return 0;
}
