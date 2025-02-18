#include <iostream>
#include <string>

int main()
{
    int n;
    std::string s;
    std::cin >> n >> s;
    int ans = 0;
    for (int i = 0; i < (int)s.size(); i++)
    {
        int g = 0;
        int h = 0;
        for (int j = i; j < (int)s.size(); j++)
        {
            if (s[j] == 'G')
                g++;
            else
                h++;
            if (g + h >= 3 && (g == 1 || h == 1))
                ans++;
        }
    }
    std::cout << ans << "\n";
}