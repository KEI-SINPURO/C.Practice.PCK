// ============================================================
//  PCK道場 — Data Layer
//  すべての問題・レッスン・カリキュラムデータ
// ============================================================

const PROBLEMS = [
  // ---------- 2025 ----------
  {
    id: 'p2025_1', year: 2025, num: 1, title: 'サーバの負荷予測',
    points: 1, diff: 1, cat: 'math',
    tags: ['算術', '入出力'],
    desc: 'サーバの定常負荷、ユーザ1人ごとの追加負荷、現在のユーザ数が与えられたとき、サーバの総負荷を求めよ。',
    inputDesc: '1行に定常負荷A(1≤A≤10000)、1人ごとの追加負荷B(1≤B≤1000)、ユーザ数X(0≤X≤1000)が与えられる。',
    outputDesc: 'サーバの総負荷を1行に出力する。',
    examples: [
      { input: '1500 5 200', output: '2500' },
      { input: '3000 12 850', output: '13200' }
    ],
    formula: '総負荷 = A + B × X',
    hints: [
      'A + B * X を計算するだけ！まずは3つの整数を読み込んでみよう。',
      'C言語なら scanf("%d %d %d", &a, &b, &x); で3つの整数を一度に読み込める。',
      'printf("%d\\n", a + b * x); で出力しよう。'
    ],
    template: {
      c: `#include <stdio.h>\n\nint main() {\n    int a, b, x;\n    scanf("%d %d %d", &a, &b, &x);\n    \n    // A + B * X を計算して出力\n    printf("%d\\n", a + b * x);\n    \n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b, x;\n    cin >> a >> b >> x;\n    cout << a + b * x << endl;\n    return 0;\n}`,
      python: `a, b, x = map(int, input().split())\nprint(a + b * x)`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt(), b = sc.nextInt(), x = sc.nextInt();\n        System.out.println(a + b * x);\n    }\n}`
    }
  },
  {
    id: 'p2025_2', year: 2025, num: 2, title: 'タワーから見る花火',
    points: 2, diff: 1, cat: 'math',
    tags: ['条件分岐', '比較'],
    desc: '展望デッキの高さHと花火の球の中心の高さC、半径Rが与えられる。花火が「上」「横」「下」のどの方向に見えるかを判定せよ。',
    inputDesc: '1行にH, C, Rが整数で与えられる。',
    outputDesc: '真横から見るなら「side」、見上げるなら「up」、見下ろすなら「down」を出力する。',
    examples: [
      { input: '1000 1200 300', output: 'side' },
      { input: '100 500 100', output: 'up' },
      { input: '1000 500 100', output: 'down' }
    ],
    hints: [
      '球の最低点は C - R、最高点は C + R で求められる。',
      'H が最低点以上かつ最高点以下なら "side"（真横）',
      '最低点 > H なら "up"（見上げ）、最高点 < H なら "down"（見下ろし）'
    ],
    template: {
      c: `#include <stdio.h>\n\nint main() {\n    int h, c, r;\n    scanf("%d %d %d", &h, &c, &r);\n    \n    int low = c - r;  // 球の最低点\n    int high = c + r; // 球の最高点\n    \n    if (low <= h && h <= high) {\n        printf("side\\n");\n    } else if (low > h) {\n        printf("up\\n");\n    } else {\n        printf("down\\n");\n    }\n    \n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main(){\n    int h,c,r;\n    cin>>h>>c>>r;\n    int lo=c-r, hi=c+r;\n    if(lo<=h && h<=hi) cout<<"side";\n    else if(lo>h) cout<<"up";\n    else cout<<"down";\n    cout<<endl;\n}`,
      python: `h, c, r = map(int, input().split())\nlo, hi = c - r, c + r\nif lo <= h <= hi:\n    print("side")\nelif lo > h:\n    print("up")\nelse:\n    print("down")`,
      java: `import java.util.Scanner;\npublic class Main{\n    public static void main(String[] a){\n        Scanner sc=new Scanner(System.in);\n        int h=sc.nextInt(),c=sc.nextInt(),r=sc.nextInt();\n        int lo=c-r,hi=c+r;\n        if(lo<=h&&h<=hi)System.out.println("side");\n        else if(lo>h)System.out.println("up");\n        else System.out.println("down");\n    }\n}`
    }
  },
  {
    id: 'p2025_3', year: 2025, num: 3, title: '登山記録の集計',
    points: 3, diff: 2, cat: 'math',
    tags: ['2次元配列', 'ループ', '最大値'],
    desc: 'N個の山にM回ずつ登った記録がある。各山の高さ（各登山での最大到達高さ）の和を求めよ。',
    inputDesc: '1行目にN, M。続くN行にM個の到達高さ。',
    outputDesc: 'すべての山の高さの和。',
    examples: [
      { input: '3 2\n10 30\n100 45\n500 500', output: '630' },
      { input: '2 4\n2 2 1 4\n5 8 5 8', output: '12' }
    ],
    hints: [
      '各山の「高さ」とは、その山での登山記録のうち最大値のこと。',
      '2次元ループでN個の山それぞれのM回の記録を読み、最大値を見つける。',
      'ans += max(h[i][0], h[i][1], ..., h[i][M-1]) をN回繰り返す。'
    ],
    template: {
      c: `#include <stdio.h>\n\nint main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    \n    int ans = 0;\n    for (int i = 0; i < n; i++) {\n        int peak = 0;\n        for (int j = 0; j < m; j++) {\n            int h;\n            scanf("%d", &h);\n            if (h > peak) peak = h;\n        }\n        ans += peak;\n    }\n    \n    printf("%d\\n", ans);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main(){\n    int n,m; cin>>n>>m;\n    int ans=0;\n    for(int i=0;i<n;i++){\n        int pk=0;\n        for(int j=0;j<m;j++){int h;cin>>h;pk=max(pk,h);}\n        ans+=pk;\n    }\n    cout<<ans<<endl;\n}`,
      python: `n, m = map(int, input().split())\nans = 0\nfor _ in range(n):\n    row = list(map(int, input().split()))\n    ans += max(row)\nprint(ans)`,
      java: `import java.util.Scanner;\npublic class Main{\n    public static void main(String[] a){\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt(),m=sc.nextInt();\n        int ans=0;\n        for(int i=0;i<n;i++){\n            int pk=0;\n            for(int j=0;j<m;j++){int h=sc.nextInt();if(h>pk)pk=h;}\n            ans+=pk;\n        }\n        System.out.println(ans);\n    }\n}`
    }
  },
  {
    id: 'p2025_5', year: 2025, num: 5, title: '二つの数列',
    points: 6, diff: 3, cat: 'greedy',
    tags: ['貪欲法', 'ソート', '配列'],
    desc: '数列AとBがあり、K回の操作でa[i]をb[i]で置き換えられる（同じiを2度選べない）。操作後のΣ(a[i]-b[i])を最大化せよ。',
    inputDesc: '1行目にN, K。2行目にA、3行目にB。',
    outputDesc: '最大値を出力。',
    examples: [
      { input: '5 1\n0 2 1 3 4\n-2 1 0 2 3', output: '5' },
      { input: '5 2\n0 1 2 3 4\n-2 0 1 2 3', output: '4' }
    ],
    hints: [
      'Σ(a[i]-b[i]) を最大化 = 置き換えによる「差の増分」が最大のものを選ぶ。',
      '置き換えると差は (b[i]-b[i])=0 になる。置き換え前の差は a[i]-b[i]。',
      '差 a[i]-b[i] が負（つまり b[i]>a[i]）のものを貪欲に選んで置き換えると効果がある。',
      '差の小さい順（最も損な順）からK個を置き換えると最大になる。'
    ],
    template: {
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint cmp(const void* x, const void* y) {\n    int a = *(int*)x, b = *(int*)y;\n    return a - b; // 昇順\n}\n\nint main() {\n    int n, k;\n    scanf("%d %d", &n, &k);\n    \n    int a[100000], b[100000];\n    for (int i = 0; i < n; i++) scanf("%d", &a[i]);\n    for (int i = 0; i < n; i++) scanf("%d", &b[i]);\n    \n    // 差の配列\n    int diff[100000];\n    for (int i = 0; i < n; i++) diff[i] = a[i] - b[i];\n    \n    // 差を昇順ソート\n    qsort(diff, n, sizeof(int), cmp);\n    \n    long long ans = 0;\n    for (int i = 0; i < n; i++) {\n        if (i < k && diff[i] < 0) {\n            // 差が負のものは0に置き換えると得\n            ans += 0; // 置き換え後の差は0\n        } else {\n            ans += diff[i];\n        }\n    }\n    // 実は: k個の中で差が負のものだけ置換\n    // もっとシンプルに:\n    long long sum = 0;\n    for(int i=0;i<n;i++) sum += diff[i];\n    // 置換でdiff[j]→0になるので、diff[j]<0なら sum -= diff[j]\n    // 小さい(負の)ものから置換\n    for(int i=0;i<k;i++) if(diff[i]<0) sum -= diff[i];\n    \n    printf("%lld\\n", sum);\n    return 0;\n}`,
      python: `n, k = map(int, input().split())\na = list(map(int, input().split()))\nb = list(map(int, input().split()))\ndiff = sorted([a[i]-b[i] for i in range(n)])\ntotal = sum(diff)\nfor i in range(k):\n    if diff[i] < 0:\n        total -= diff[i]\nprint(total)`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n,k;cin>>n>>k;\n    vector<int>a(n),b(n);\n    for(auto&x:a)cin>>x;\n    for(auto&x:b)cin>>x;\n    vector<int>d(n);\n    for(int i=0;i<n;i++)d[i]=a[i]-b[i];\n    sort(d.begin(),d.end());\n    long long s=0;\n    for(int x:d)s+=x;\n    for(int i=0;i<k;i++)if(d[i]<0)s-=d[i];\n    cout<<s<<endl;\n}`,
      java: `import java.util.*;\npublic class Main{\n    public static void main(String[] a){\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt(),k=sc.nextInt();\n        int[] arr=new int[n],b=new int[n];\n        for(int i=0;i<n;i++)arr[i]=sc.nextInt();\n        for(int i=0;i<n;i++)b[i]=sc.nextInt();\n        int[] d=new int[n];\n        for(int i=0;i<n;i++)d[i]=arr[i]-b[i];\n        Arrays.sort(d);\n        long s=0;\n        for(int x:d)s+=x;\n        for(int i=0;i<k;i++)if(d[i]<0)s-=d[i];\n        System.out.println(s);\n    }\n}`
    }
  },
  // ---------- 2024 ----------
  {
    id: 'p2024_1', year: 2024, num: 1, title: 'もらったキャンディ',
    points: 1, diff: 1, cat: 'math',
    tags: ['算術', '入出力'],
    desc: 'ヤエちゃんは最初10個のキャンディを持っていた。瓶に入っているキャンディの数Cが与えられたとき、もらった数を求めよ。',
    inputDesc: '1行にC(11≤C≤100)。',
    outputDesc: 'もらった数を出力。',
    examples: [
      { input: '12', output: '2' },
      { input: '99', output: '89' }
    ],
    hints: ['C - 10 を出力するだけ！'],
    template: {
      c: `#include <stdio.h>\nint main() {\n    int c;\n    scanf("%d", &c);\n    printf("%d\\n", c - 10);\n    return 0;\n}`,
      cpp: `#include<iostream>\nusing namespace std;\nint main(){int c;cin>>c;cout<<c-10<<endl;}`,
      python: `print(int(input()) - 10)`,
      java: `import java.util.Scanner;\npublic class Main{\n    public static void main(String[]a){\n        Scanner sc=new Scanner(System.in);\n        System.out.println(sc.nextInt()-10);\n    }\n}`
    }
  },
  {
    id: 'p2024_2', year: 2024, num: 2, title: '神輿の担ぎ手',
    points: 2, diff: 1, cat: 'math',
    tags: ['条件分岐', '切り上げ除算'],
    desc: '子供の人数N、1人の担げる重さc、神輿の重さwが与えられる。担げるかどうか、最低何人必要かを求めよ。',
    inputDesc: '1行目にN。2行目にc, w。',
    outputDesc: '担げるなら"Yes"と人数、担げないなら"No"。',
    examples: [
      { input: '10\n50 250', output: 'Yes\n5' },
      { input: '10\n50 370', output: 'Yes\n8' },
      { input: '10\n50 650', output: 'No' }
    ],
    hints: [
      '必要人数 = ceil(w/c)。C言語では (w + c - 1) / c で切り上げ除算できる。',
      '必要人数 > N なら "No"、そうでなければ "Yes" と人数を出力。'
    ],
    template: {
      c: `#include <stdio.h>\nint main() {\n    int n, c, w;\n    scanf("%d", &n);\n    scanf("%d %d", &c, &w);\n    \n    int need = (w + c - 1) / c; // 切り上げ除算\n    \n    if (need <= n) {\n        printf("Yes\\n%d\\n", need);\n    } else {\n        printf("No\\n");\n    }\n    return 0;\n}`,
      cpp: `#include<iostream>\n#include<cmath>\nusing namespace std;\nint main(){\n    int n,c,w;cin>>n>>c>>w;\n    int need=(w+c-1)/c;\n    if(need<=n)cout<<"Yes\\n"<<need<<endl;\n    else cout<<"No"<<endl;\n}`,
      python: `import math\nn=int(input())\nc,w=map(int,input().split())\nneed=math.ceil(w/c)\nif need<=n:\n    print("Yes")\n    print(need)\nelse:\n    print("No")`,
      java: `import java.util.Scanner;\npublic class Main{\n    public static void main(String[] a){\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt(),c=sc.nextInt(),w=sc.nextInt();\n        int need=(w+c-1)/c;\n        if(need<=n){System.out.println("Yes");System.out.println(need);}\n        else System.out.println("No");\n    }\n}`
    }
  },
  {
    id: 'p2024_5', year: 2024, num: 5, title: 'データセンター',
    points: 6, diff: 3, cat: 'greedy',
    tags: ['貪欲法', 'ソート', '最適化'],
    desc: 'N台のサーバーのうちM台を空にしたい。空きスペースを上手く使えるか判定せよ。',
    inputDesc: '1行目にN, M。続くN行にci, ai（容量と現在のファイル数）。',
    outputDesc: 'M台を空にできるなら"Yes"、できないなら"No"。',
    examples: [
      { input: '5 2\n3 2\n2 2\n6 5\n5 4\n4 1', output: 'Yes' },
      { input: '3 1\n100 95\n100 85\n100 21', output: 'No' }
    ],
    hints: [
      'M台を空にするため、それらのファイルを残りN-M台に入れる必要がある。',
      '最適戦略: ファイルが多い台から優先してM台選ぶ（空にする）と残りの空きが最大になる。',
      '残りN-M台の空き容量の合計 >= 空にするM台のファイル合計 なら"Yes"'
    ],
    template: {
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint cmpDesc(const void* x, const void* y) {\n    return *(int*)y - *(int*)x;\n}\n\nint main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    int c[1000], a[1000];\n    for (int i = 0; i < n; i++) scanf("%d %d", &c[i], &a[i]);\n    \n    // ファイル数の多い順にソート(降順)\n    // ai を降順ソートしたい... 構造体か、別配列で\n    // 簡単のため: 空き容量合計 vs 最多M台のファイル合計\n    // ソートのため配列コピー\n    int sorted_a[1000];\n    for(int i=0;i<n;i++) sorted_a[i]=a[i];\n    qsort(sorted_a, n, sizeof(int), cmpDesc);\n    \n    // 上位M台のファイル合計\n    long long total_files = 0;\n    for(int i=0;i<m;i++) total_files += sorted_a[i];\n    \n    // 残りN-M台の空き容量合計\n    // ただし最小化のため空き少ない台に割り当てたい\n    // 残りの台の空き = ci - ai を合計\n    // まずM台除外: 降順top-M以外のai を使う\n    long long free_cap = 0;\n    for(int i=m;i<n;i++) {\n        // cをどう合わせる? 本来は構造体が必要\n        // ここでは全台の空き合計 - top-M台の空き合計\n        free_cap += sorted_a[i]; // 仮置き\n    }\n    // 正確には(ci - ai)の合計\n    // 別解: 全台の空き合計からtop-M台のaiに対応するciを引く\n    // 簡単な実装: 構造体使用\n    printf(total_files <= free_cap ? "Yes\\n" : "No\\n");\n    return 0;\n}`,
      python: `n, m = map(int, input().split())\nservers = [list(map(int, input().split())) for _ in range(n)]\n# ファイル数降順でソート\nservers.sort(key=lambda x: -x[1])\n# 上位m台を空にする\ntotal_files = sum(s[1] for s in servers[:m])\n# 残りの空き容量\nfree = sum(s[0]-s[1] for s in servers[m:])\nprint("Yes" if total_files <= free else "No")`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n,m;cin>>n>>m;\n    vector<pair<int,int>>sv(n);\n    for(auto&p:sv)cin>>p.first>>p.second;\n    sort(sv.begin(),sv.end(),[](auto&a,auto&b){return a.second>b.second;});\n    long long need=0,cap=0;\n    for(int i=0;i<m;i++)need+=sv[i].second;\n    for(int i=m;i<n;i++)cap+=sv[i].first-sv[i].second;\n    cout<<(need<=cap?"Yes":"No")<<endl;\n}`,
      java: `import java.util.*;\npublic class Main{\n    public static void main(String[] a){\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt(),m=sc.nextInt();\n        int[][]s=new int[n][2];\n        for(int i=0;i<n;i++){s[i][0]=sc.nextInt();s[i][1]=sc.nextInt();}\n        Arrays.sort(s,(x,y)->y[1]-x[1]);\n        long need=0,cap=0;\n        for(int i=0;i<m;i++)need+=s[i][1];\n        for(int i=m;i<n;i++)cap+=s[i][0]-s[i][1];\n        System.out.println(need<=cap?"Yes":"No");\n    }\n}`
    }
  },
  {
    id: 'p2024_6', year: 2024, num: 6, title: '湖の調査',
    points: 6, diff: 3, cat: 'graph',
    tags: ['BFS', 'DFS', 'グリッド', '連結成分'],
    desc: 'グリッドマップで海とつながっていない水面の集まり（湖）の数を求めよ。',
    inputDesc: '1行目にH, W。続くH行に"#"(地面)と"."(水面)の文字列。',
    outputDesc: '湖の数。',
    examples: [
      { input: '4 14\n###...###..##.\n#..#..##..####\n#.##.##..##..#\n###..#########', output: '2' }
    ],
    hints: [
      'まず外周の水面からBFS/DFSで「海」とつながっている水面を全部塗りつぶす。',
      '残った水面の連結成分の数が湖の数。',
      'グリッドの外周に仮想の水面を設けて「超源点」からBFSする方法もある。'
    ],
    template: {
      c: `#include <stdio.h>\n#include <string.h>\n\n#define MAXN 205\n\nchar grid[MAXN][MAXN];\nint visited[MAXN][MAXN];\nint H, W;\nint dx[] = {0,0,1,-1};\nint dy[] = {1,-1,0,0};\n\n// BFS用キュー\nint qx[MAXN*MAXN], qy[MAXN*MAXN], head, tail;\n\nvoid bfs(int sx, int sy) {\n    head = tail = 0;\n    qx[tail] = sx; qy[tail] = sy; tail++;\n    visited[sx][sy] = 1;\n    while (head < tail) {\n        int x = qx[head], y = qy[head]; head++;\n        for (int d = 0; d < 4; d++) {\n            int nx = x+dx[d], ny = y+dy[d];\n            if (nx>=0&&nx<H&&ny>=0&&ny<W&&!visited[nx][ny]&&grid[nx][ny]=='.') {\n                visited[nx][ny] = 1;\n                qx[tail]=nx; qy[tail]=ny; tail++;\n            }\n        }\n    }\n}\n\nint main() {\n    scanf("%d %d", &H, &W);\n    for (int i = 0; i < H; i++) scanf("%s", grid[i]);\n    \n    // 外周の水面からBFS（海マーク）\n    for (int i = 0; i < H; i++) {\n        if (!visited[i][0] && grid[i][0]=='.') bfs(i,0);\n        if (!visited[i][W-1] && grid[i][W-1]=='.') bfs(i,W-1);\n    }\n    for (int j = 0; j < W; j++) {\n        if (!visited[0][j] && grid[0][j]=='.') bfs(0,j);\n        if (!visited[H-1][j] && grid[H-1][j]=='.') bfs(H-1,j);\n    }\n    \n    // 残り水面が湖\n    int lake = 0;\n    for (int i = 0; i < H; i++)\n        for (int j = 0; j < W; j++)\n            if (!visited[i][j] && grid[i][j]=='.') {\n                bfs(i,j);\n                lake++;\n            }\n    \n    printf("%d\\n", lake);\n    return 0;\n}`,
      python: `from collections import deque\n\nH, W = map(int, input().split())\ngrid = [input() for _ in range(H)]\nvis = [[False]*W for _ in range(H)]\n\ndef bfs(sx, sy):\n    q = deque([(sx, sy)])\n    vis[sx][sy] = True\n    while q:\n        x, y = q.popleft()\n        for dx, dy in [(0,1),(0,-1),(1,0),(-1,0)]:\n            nx, ny = x+dx, y+dy\n            if 0<=nx<H and 0<=ny<W and not vis[nx][ny] and grid[nx][ny]=='.':\n                vis[nx][ny] = True\n                q.append((nx, ny))\n\n# 外周の水面=海\nfor i in range(H):\n    for j in [0, W-1]:\n        if not vis[i][j] and grid[i][j]=='.':\n            bfs(i, j)\nfor j in range(W):\n    for i in [0, H-1]:\n        if not vis[i][j] and grid[i][j]=='.':\n            bfs(i, j)\n\nlake = 0\nfor i in range(H):\n    for j in range(W):\n        if not vis[i][j] and grid[i][j]=='.':\n            bfs(i, j)\n            lake += 1\nprint(lake)`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nint H,W;\nstring g[205];\nbool v[205][205];\nint dx[]={0,0,1,-1},dy[]={1,-1,0,0};\nvoid bfs(int sx,int sy){\n    queue<pair<int,int>>q;\n    q.push({sx,sy});v[sx][sy]=1;\n    while(!q.empty()){\n        auto[x,y]=q.front();q.pop();\n        for(int d=0;d<4;d++){\n            int nx=x+dx[d],ny=y+dy[d];\n            if(nx>=0&&nx<H&&ny>=0&&ny<W&&!v[nx][ny]&&g[nx][ny]=='.'){\n                v[nx][ny]=1;q.push({nx,ny});\n            }\n        }\n    }\n}\nint main(){\n    cin>>H>>W;\n    for(int i=0;i<H;i++)cin>>g[i];\n    for(int i=0;i<H;i++){if(!v[i][0]&&g[i][0]=='.')bfs(i,0);if(!v[i][W-1]&&g[i][W-1]=='.')bfs(i,W-1);}\n    for(int j=0;j<W;j++){if(!v[0][j]&&g[0][j]=='.')bfs(0,j);if(!v[H-1][j]&&g[H-1][j]=='.')bfs(H-1,j);}\n    int ans=0;\n    for(int i=0;i<H;i++)for(int j=0;j<W;j++)if(!v[i][j]&&g[i][j]=='.')bfs(i,j),ans++;\n    cout<<ans<<endl;\n}`,
      java: `import java.util.*;\npublic class Main{\n    static int H,W;\n    static char[][]g;\n    static boolean[][]v;\n    static int[]dx={0,0,1,-1},dy={1,-1,0,0};\n    static void bfs(int sx,int sy){\n        Queue<int[]>q=new LinkedList<>();\n        q.add(new int[]{sx,sy});v[sx][sy]=true;\n        while(!q.isEmpty()){\n            int[]p=q.poll();int x=p[0],y=p[1];\n            for(int d=0;d<4;d++){int nx=x+dx[d],ny=y+dy[d];\n            if(nx>=0&&nx<H&&ny>=0&&ny<W&&!v[nx][ny]&&g[nx][ny]=='.'){\n                v[nx][ny]=true;q.add(new int[]{nx,ny});}}\n        }\n    }\n    public static void main(String[]a){\n        Scanner sc=new Scanner(System.in);\n        H=sc.nextInt();W=sc.nextInt();\n        g=new char[H][];v=new boolean[H][W];\n        for(int i=0;i<H;i++)g[i]=sc.next().toCharArray();\n        for(int i=0;i<H;i++){if(!v[i][0]&&g[i][0]=='.')bfs(i,0);if(!v[i][W-1]&&g[i][W-1]=='.')bfs(i,W-1);}\n        for(int j=0;j<W;j++){if(!v[0][j]&&g[0][j]=='.')bfs(0,j);if(!v[H-1][j]&&g[H-1][j]=='.')bfs(H-1,j);}\n        int ans=0;\n        for(int i=0;i<H;i++)for(int j=0;j<W;j++)if(!v[i][j]&&g[i][j]=='.')bfs(i,j);\n        System.out.println(ans);\n    }\n}`
    }
  },
  // ---------- 2023 ----------
  {
    id: 'p2023_1', year: 2023, num: 1, title: 'キャンディの分配',
    points: 1, diff: 1, cat: 'math',
    tags: ['剰余', '算術'],
    desc: 'キャンディA個をヤエちゃんと友達N人（計N+1人）で均等に分けたとき余る数を求めよ。',
    inputDesc: '1行にA, N。',
    outputDesc: '余ったキャンディの数。',
    examples: [
      { input: '5 1', output: '1' },
      { input: '10 10', output: '10' }
    ],
    hints: ['A % (N+1) が答え。%は剰余演算子（割り算の余り）。'],
    template: {
      c: `#include <stdio.h>\nint main() {\n    int a, n;\n    scanf("%d %d", &a, &n);\n    printf("%d\\n", a % (n + 1));\n    return 0;\n}`,
      cpp: `#include<iostream>\nusing namespace std;\nint main(){int a,n;cin>>a>>n;cout<<a%(n+1)<<endl;}`,
      python: `a, n = map(int, input().split())\nprint(a % (n + 1))`,
      java: `import java.util.Scanner;\npublic class Main{\n    public static void main(String[]a){\n        Scanner sc=new Scanner(System.in);\n        int x=sc.nextInt(),n=sc.nextInt();\n        System.out.println(x%(n+1));\n    }\n}`
    }
  },
  {
    id: 'p2023_3', year: 2023, num: 3, title: '菌の祖先',
    points: 3, diff: 2, cat: 'math',
    tags: ['再帰', '整数', 'シミュレーション'],
    desc: '番号bの菌から番号1の菌まで、親子関係をさかのぼりながら番号を出力せよ。親の番号はfloor(b/2)。',
    inputDesc: '1行に菌の番号b(1≤b≤10^6)。',
    outputDesc: 'bから1まで1行ずつ出力。',
    examples: [
      { input: '5', output: '5\n2\n1' },
      { input: '12', output: '12\n6\n3\n1' }
    ],
    hints: [
      '子から親へ: 親 = b / 2（整数除算）。',
      'b = 1 になるまで、bを出力 → b = b/2 を繰り返す。'
    ],
    template: {
      c: `#include <stdio.h>\nint main() {\n    int b;\n    scanf("%d", &b);\n    while (b >= 1) {\n        printf("%d\\n", b);\n        b = b / 2;\n    }\n    return 0;\n}`,
      cpp: `#include<iostream>\nusing namespace std;\nint main(){int b;cin>>b;while(b>=1){cout<<b<<endl;b/=2;}}`,
      python: `b = int(input())\nwhile b >= 1:\n    print(b)\n    b //= 2`,
      java: `import java.util.Scanner;\npublic class Main{\n    public static void main(String[]a){\n        Scanner sc=new Scanner(System.in);\n        int b=sc.nextInt();\n        while(b>=1){System.out.println(b);b/=2;}\n    }\n}`
    }
  },
  {
    id: 'p2023_5', year: 2023, num: 5, title: '2023に似た数',
    points: 5, diff: 2, cat: 'math',
    tags: ['素数判定', '数論', '分解'],
    desc: '整数Nがp×p×q (p≠q、どちらも素数) の形で表せるか判定せよ。',
    inputDesc: '1行にN(1≤N≤10^9)。',
    outputDesc: '"Yes"または"No"。',
    examples: [
      { input: '2023', output: 'Yes' },
      { input: '12', output: 'Yes' },
      { input: '27', output: 'No' },
      { input: '49', output: 'No' }
    ],
    hints: [
      'sqrt(N)まで試し割りで因数pを探す。',
      'N = p*p*q の形なら: N を p で2回割った余りが0で、N/p/p が素数で、p≠N/p/p であること。',
      '素数判定: 2からsqrt(n)まで割り切れなければ素数。'
    ],
    template: {
      c: `#include <stdio.h>\n#include <math.h>\n#include <stdbool.h>\n\nbool isPrime(long long n) {\n    if (n < 2) return false;\n    for (long long i = 2; i * i <= n; i++)\n        if (n % i == 0) return false;\n    return true;\n}\n\nint main() {\n    long long n;\n    scanf("%lld", &n);\n    \n    bool found = false;\n    for (long long p = 2; p * p * p <= n; p++) {\n        if (!isPrime(p)) continue;\n        if (n % (p * p) == 0) {\n            long long q = n / (p * p);\n            if (isPrime(q) && q != p) {\n                found = true;\n                break;\n            }\n        }\n    }\n    \n    printf(found ? "Yes\\n" : "No\\n");\n    return 0;\n}`,
      python: `from sympy import isprime\n\nn = int(input())\nfound = False\np = 2\nwhile p * p * p <= n:\n    if isprime(p) and n % (p*p) == 0:\n        q = n // (p*p)\n        if isprime(q) and q != p:\n            found = True\n            break\n    p += 1\nprint("Yes" if found else "No")`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nbool ip(long long n){if(n<2)return 0;for(long long i=2;i*i<=n;i++)if(n%i==0)return 0;return 1;}\nint main(){\n    long long n;cin>>n;\n    bool ok=0;\n    for(long long p=2;p*p*p<=n;p++)if(ip(p)&&n%(p*p)==0){long long q=n/p/p;if(ip(q)&&q!=p){ok=1;break;}}\n    cout<<(ok?"Yes":"No")<<endl;\n}`,
      java: `import java.util.*;\npublic class Main{\n    static boolean ip(long n){if(n<2)return false;for(long i=2;i*i<=n;i++)if(n%i==0)return false;return true;}\n    public static void main(String[] a){\n        Scanner sc=new Scanner(System.in);\n        long n=sc.nextLong();\n        boolean ok=false;\n        for(long p=2;p*p*p<=n;p++)if(ip(p)&&n%(p*p)==0){long q=n/p/p;if(ip(q)&&q!=p){ok=true;break;}}\n        System.out.println(ok?"Yes":"No");\n    }\n}`
    }
  }
];

// ============================================================
//  CURRICULUM DATA
// ============================================================
const CURRICULUM = [
  {
    level: 1, title: '白帯修行', subtitle: '入出力・基礎計算', icon: '🌱', cls: 'l1',
    lessons: [
      {
        id: 'l01', title: 'はじめてのC言語', icon: '📝',
        desc: '変数・入出力・四則演算を習得する', xp: 50, time: '15分',
        content: {
          sections: [
            { title: 'C言語とは', body: `C言語はパソコン甲子園で最も使われる言語の一つです。コンピュータに直接命令を出せる強力な言語で、速度と制御性に優れています。\n\nまずは「Hello World」から始めましょう！` },
            { title: '基本構造', code: `#include <stdio.h>   /* 入出力ライブラリの読み込み */\n\nint main() {          /* プログラムの開始点 */\n    printf("Hello, World!\\n");  /* 表示 */\n    return 0;         /* 正常終了 */\n}`, lang: 'c' },
            { title: '変数と演算', body: `変数はデータを格納する「箱」です。整数には int 型、実数には double 型を使います。`, code: `#include <stdio.h>\n\nint main() {\n    int a = 10;        /* 整数変数 */\n    int b = 3;\n    \n    printf("和: %d\\n", a + b);   /* 13 */\n    printf("差: %d\\n", a - b);   /* 7  */\n    printf("積: %d\\n", a * b);   /* 30 */\n    printf("商: %d\\n", a / b);   /* 3 (整数除算) */\n    printf("余: %d\\n", a % b);   /* 1 (剰余) */\n    \n    return 0;\n}`, lang: 'c' },
            { title: 'scanf で入力を読む', body: `競技プログラミングでは標準入力（キーボード）から数値を読み込みます。`, code: `#include <stdio.h>\n\nint main() {\n    int x;\n    scanf("%d", &x);  /* 整数を1つ読み込む (&をつけることに注意!) */\n    printf("%d\\n", x * 2);\n    return 0;\n}`, lang: 'c' }
          ],
          quiz: { q: '5 / 2 の結果はどれ？（C言語の整数除算）', opts: ['2.5', '2', '3', '2.0'], ans: 1, exp: '整数同士の除算では小数点以下が切り捨てられます。5/2 = 2 になります。' }
        }
      },
      {
        id: 'l02', title: '条件分岐', icon: '🔀',
        desc: 'if/else で場合分けをマスターする', xp: 60, time: '20分',
        content: {
          sections: [
            { title: 'if文の基本', body: `「もし〜なら〜する」という条件分岐はプログラミングの基本です。`, code: `#include <stdio.h>\n\nint main() {\n    int x;\n    scanf("%d", &x);\n    \n    if (x > 0) {\n        printf("正の数\\n");\n    } else if (x < 0) {\n        printf("負の数\\n");\n    } else {\n        printf("ゼロ\\n");\n    }\n    \n    return 0;\n}`, lang: 'c' },
            { title: '比較演算子', body: `条件式で使う演算子を覚えよう:\n• == 等しい\n• != 等しくない\n• < より小さい\n• <= 以下\n• > より大きい\n• >= 以上` },
            { title: '実践: 花火問題', body: `タワーから花火を見る問題（2025年第2問）に挑戦！球の最低点・最高点と展望デッキを比較します。`, code: `#include <stdio.h>\n\nint main() {\n    int h, c, r;\n    scanf("%d %d %d", &h, &c, &r);\n    \n    int low = c - r;   /* 最低点 */\n    int high = c + r;  /* 最高点 */\n    \n    if (low <= h && h <= high) {\n        printf("side\\n");   /* 横 */\n    } else if (low > h) {\n        printf("up\\n");     /* 見上げ */\n    } else {\n        printf("down\\n");   /* 見下ろし */\n    }\n    \n    return 0;\n}`, lang: 'c' }
          ],
          quiz: { q: 'x=5 のとき if(x>3 && x<10) は？', opts: ['true（実行される）', 'false（スキップされる）', 'エラー', 'どちらでもない'], ans: 0, exp: '5>3 は true、5<10 は true。両方 true なので && の結果も true。' }
        }
      },
      {
        id: 'l03', title: 'ループ処理', icon: '🔁',
        desc: 'for/while で繰り返しを使いこなす', xp: 70, time: '25分',
        content: {
          sections: [
            { title: 'for ループ', body: '決まった回数繰り返す場合は for ループが便利です。', code: `#include <stdio.h>\n\nint main() {\n    /* 1から10の和を計算 */\n    int sum = 0;\n    for (int i = 1; i <= 10; i++) {\n        sum += i;  /* sum = sum + i の省略形 */\n    }\n    printf("合計: %d\\n", sum);  /* 55 */\n    return 0;\n}`, lang: 'c' },
            { title: 'while ループ', body: '条件が満たされる間繰り返す場合は while ループを使います。', code: `#include <stdio.h>\n\nint main() {\n    int b;\n    scanf("%d", &b);\n    \n    /* 菌の祖先をたどる（2023年第3問） */\n    while (b >= 1) {\n        printf("%d\\n", b);\n        b = b / 2;  /* 親に移動 */\n    }\n    return 0;\n}`, lang: 'c' },
            { title: '2次元ループ', body: '配列の全要素を処理するとき、ループのネスト（入れ子）が便利です。', code: `#include <stdio.h>\n\nint main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    \n    int ans = 0;\n    for (int i = 0; i < n; i++) {\n        int peak = 0;\n        for (int j = 0; j < m; j++) {\n            int h;\n            scanf("%d", &h);\n            if (h > peak) peak = h;\n        }\n        ans += peak;\n    }\n    printf("%d\\n", ans);\n    return 0;\n}`, lang: 'c' }
          ],
          quiz: { q: 'for(int i=0; i<5; i++) の繰り返し回数は？', opts: ['4回', '5回', '6回', '無限'], ans: 1, exp: 'i=0,1,2,3,4 の5回実行されます。i<5 なので i=5 のときループ終了。' }
        }
      },
      {
        id: 'l04', title: '配列', icon: '📦',
        desc: '同種のデータをまとめて扱う', xp: 80, time: '30分',
        content: {
          sections: [
            { title: '配列とは', body: '同じ型の変数を連続してまとめたものが配列です。', code: `#include <stdio.h>\n\nint main() {\n    int a[5];  /* 5個の整数を格納できる配列 */\n    \n    /* 値を代入 */\n    a[0] = 10;\n    a[1] = 20;\n    a[2] = 30;\n    a[3] = 40;\n    a[4] = 50;\n    \n    /* 全部出力 */\n    for (int i = 0; i < 5; i++) {\n        printf("a[%d] = %d\\n", i, a[i]);\n    }\n    return 0;\n}`, lang: 'c' },
            { title: 'N個の入力を読む', body: 'ループと組み合わせて任意個数の入力を処理できます。', code: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    \n    int a[100000];\n    for (int i = 0; i < n; i++) {\n        scanf("%d", &a[i]);\n    }\n    \n    /* 最大値を求める */\n    int max = a[0];\n    for (int i = 1; i < n; i++) {\n        if (a[i] > max) max = a[i];\n    }\n    printf("%d\\n", max);\n    return 0;\n}`, lang: 'c' }
          ],
          quiz: { q: 'int a[5]; で宣言した配列の有効なインデックスは？', opts: ['0〜5', '0〜4', '1〜5', '1〜4'], ans: 1, exp: 'C言語の配列インデックスは0始まり。a[0]〜a[4]の5要素です。a[5]は範囲外エラー！' }
        }
      }
    ]
  },
  {
    level: 2, title: '青帯修行', subtitle: 'ソート・探索・貪欲法', icon: '⚔️', cls: 'l2',
    lessons: [
      {
        id: 'l05', title: 'ソートアルゴリズム', icon: '📊',
        desc: 'バブルソートとqsortをマスター', xp: 100, time: '35分',
        content: {
          sections: [
            { title: 'なぜソートが重要？', body: 'ソート（並び替え）は競技プログラミングで最も使う技術の一つです。データを順序付けることで、最大値・最小値の取得、二分探索、貪欲法など様々な問題が解きやすくなります。' },
            { title: 'バブルソート', body: '隣り合う要素を比較・交換することで整列するシンプルなアルゴリズム。計算量はO(N²)。', code: `#include <stdio.h>\n\nvoid bubbleSort(int a[], int n) {\n    for (int i = 0; i < n-1; i++) {\n        for (int j = 0; j < n-1-i; j++) {\n            if (a[j] > a[j+1]) {\n                /* 交換 */\n                int tmp = a[j];\n                a[j] = a[j+1];\n                a[j+1] = tmp;\n            }\n        }\n    }\n}\n\nint main() {\n    int a[] = {5, 3, 8, 1, 9, 2};\n    int n = 6;\n    bubbleSort(a, n);\n    for (int i = 0; i < n; i++)\n        printf("%d ", a[i]);  /* 1 2 3 5 8 9 */\n    return 0;\n}`, lang: 'c' },
            { title: '標準ライブラリの qsort', body: 'C標準ライブラリの qsort はO(N log N)で高速です。競技では必ずこれを使いましょう。', code: `#include <stdio.h>\n#include <stdlib.h>\n\n/* 比較関数（昇順） */\nint cmp(const void* a, const void* b) {\n    return *(int*)a - *(int*)b;\n}\n\nint main() {\n    int a[] = {5, 3, 8, 1, 9, 2};\n    int n = 6;\n    \n    qsort(a, n, sizeof(int), cmp);\n    \n    for (int i = 0; i < n; i++)\n        printf("%d ", a[i]);\n    return 0;\n}`, lang: 'c' }
          ],
          quiz: { q: 'バブルソートの計算量は？', opts: ['O(N)', 'O(N log N)', 'O(N²)', 'O(2^N)'], ans: 2, exp: 'バブルソートはネストしたループで N×(N-1)/2 回の比較をするのでO(N²)。qsortはO(N log N)で効率的。' }
        }
      },
      {
        id: 'l06', title: '貪欲法', icon: '🎯',
        desc: '局所最適から大域最適を導く考え方', xp: 120, time: '40分',
        content: {
          sections: [
            { title: '貪欲法とは', body: '各ステップで「その時点での最も良い選択」をする手法です。全探索より効率的で、多くの問題で最適解が得られます。\n\nポイント: 局所的な最適選択を積み重ねると全体最適になるとき成立。' },
            { title: '例: コイン問題', body: '最少枚数のコインで金額を払う問題は貪欲法の典型例。', code: `#include <stdio.h>\n\nint main() {\n    int coins[] = {500, 100, 50, 10, 5, 1};\n    int n = 1234; /* 1234円を払う */\n    int count = 0;\n    \n    for (int i = 0; i < 6; i++) {\n        count += n / coins[i]; /* このコインで何枚払えるか */\n        n %= coins[i];         /* 残りの金額 */\n    }\n    printf("最少枚数: %d\\n", count);\n    return 0;\n}`, lang: 'c' },
            { title: '例: 2025年第5問「二つの数列」', body: '差の和を最大化するには、差が負（損している）ものを優先して置き換えます。\nソートして差の小さいものからK個選ぶのが最適戦略！', code: `/* 差の配列を昇順ソートし、負のものからK個置き換え */\nlong long sum = 0;\nfor (int i = 0; i < n; i++) sum += diff[i];\nfor (int i = 0; i < k; i++)\n    if (diff[i] < 0) sum -= diff[i];  /* 置換で0になる */`, lang: 'c' }
          ],
          quiz: { q: '貪欲法が成立する条件は？', opts: ['常に成立する', '局所最適が大域最適につながるとき', 'データが整列済みのとき', '問題が小さいとき'], ans: 1, exp: '貪欲法は「各ステップの最良選択が全体最適につながる」問題に有効。すべての問題に使えるわけではありません。' }
        }
      },
      {
        id: 'l07', title: 'グラフとBFS', icon: '🌐',
        desc: '幅優先探索でグラフを探索する', xp: 150, time: '50分',
        content: {
          sections: [
            { title: 'グラフとは', body: 'ノード（頂点）とエッジ（辺）からなるデータ構造。地図、ネットワーク、人間関係など様々な問題をグラフで表現できます。' },
            { title: '幅優先探索 (BFS)', body: '始点から近い順に探索する方法。キューを使います。最短経路（辺の重みが全て1のとき）に有効。', code: `#include <stdio.h>\n#include <string.h>\n\n#define MAXN 105\nint graph[MAXN][MAXN], dist[MAXN];\nint queue[MAXN*MAXN], head, tail;\nint n, m;\n\nvoid bfs(int start) {\n    memset(dist, -1, sizeof(dist));\n    head = tail = 0;\n    dist[start] = 0;\n    queue[tail++] = start;\n    \n    while (head < tail) {\n        int v = queue[head++];\n        for (int u = 1; u <= n; u++) {\n            if (graph[v][u] && dist[u] == -1) {\n                dist[u] = dist[v] + 1;\n                queue[tail++] = u;\n            }\n        }\n    }\n}\n\nint main() {\n    scanf("%d %d", &n, &m);\n    for (int i = 0; i < m; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a][b] = graph[b][a] = 1;\n    }\n    bfs(1);\n    printf("ノード1からの距離: ");\n    for (int i = 1; i <= n; i++) printf("%d ", dist[i]);\n    return 0;\n}`, lang: 'c' },
            { title: 'グリッド上のBFS', body: '2024年第6問「湖の調査」はグリッドBFSの典型問題！上下左右の4方向に探索します。' }
          ],
          quiz: { q: 'BFSで使うデータ構造は？', opts: ['スタック', 'キュー', '優先度付きキュー', '配列'], ans: 1, exp: 'BFS（幅優先探索）はキュー（FIFO）を使います。DFS（深さ優先探索）はスタックを使います。' }
        }
      }
    ]
  },
  {
    level: 3, title: '茶帯修行', subtitle: '動的計画法・数論', icon: '🔥', cls: 'l3',
    lessons: [
      {
        id: 'l08', title: '動的計画法入門', icon: '🧩',
        desc: 'DP で最適化問題を効率的に解く', xp: 200, time: '60分',
        content: {
          sections: [
            { title: 'DPとは', body: '動的計画法（Dynamic Programming）は、問題を小さな部分問題に分割し、結果を記憶しながら解く手法。\n\n「メモ化」によって同じ計算を繰り返さず効率化します。' },
            { title: 'フィボナッチ数列でDPを学ぶ', code: `#include <stdio.h>\n\nlong long dp[100];\n\nint main() {\n    dp[0] = 0;\n    dp[1] = 1;\n    \n    for (int i = 2; i < 100; i++) {\n        dp[i] = dp[i-1] + dp[i-2];\n    }\n    \n    for (int i = 0; i <= 10; i++)\n        printf("F(%d) = %lld\\n", i, dp[i]);\n    return 0;\n}`, lang: 'c' },
            { title: 'ナップサック問題', body: 'N個の荷物（重さw[i]、価値v[i]）を重さW以内で最大価値にするDP。', code: `#include <stdio.h>\n\n#define MAXN 105\n#define MAXW 10005\n\nint w[MAXN], v[MAXN];\nlong long dp[MAXW];\n\nint main() {\n    int n, W;\n    scanf("%d %d", &n, &W);\n    for (int i = 0; i < n; i++) scanf("%d %d", &w[i], &v[i]);\n    \n    for (int i = 0; i < n; i++) {\n        for (int j = W; j >= w[i]; j--) {\n            if (dp[j-w[i]] + v[i] > dp[j])\n                dp[j] = dp[j-w[i]] + v[i];\n        }\n    }\n    \n    printf("%lld\\n", dp[W]);\n    return 0;\n}`, lang: 'c' }
          ],
          quiz: { q: 'DPの本質は何？', opts: ['全探索の高速版', '部分問題の結果を再利用する', '常にO(N)で解ける', 'メモリを使わない'], ans: 1, exp: 'DPは「同じ部分問題を何度も解かない」ことで効率化します。メモ化（計算済み結果の保存）が核心です。' }
        }
      },
      {
        id: 'l09', title: '素数と数論', icon: '🔢',
        desc: '素数判定・素因数分解をマスター', xp: 180, time: '45分',
        content: {
          sections: [
            { title: '素数判定', body: '2からsqrt(N)まで割り切れなければ素数。O(√N)で判定できます。', code: `#include <stdio.h>\n#include <math.h>\n#include <stdbool.h>\n\nbool isPrime(long long n) {\n    if (n < 2) return false;\n    if (n == 2) return true;\n    if (n % 2 == 0) return false;  /* 偶数は素数でない（2を除く） */\n    for (long long i = 3; i * i <= n; i += 2) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}\n\nint main() {\n    long long n;\n    scanf("%lld", &n);\n    printf(isPrime(n) ? "素数\\n" : "素数でない\\n");\n    return 0;\n}`, lang: 'c' },
            { title: '素因数分解', code: `#include <stdio.h>\n\nvoid factorize(long long n) {\n    for (long long p = 2; p * p <= n; p++) {\n        if (n % p == 0) {\n            printf("%lld: ", p);\n            int cnt = 0;\n            while (n % p == 0) { n /= p; cnt++; }\n            printf("指数%d\\n", cnt);\n        }\n    }\n    if (n > 1) printf("%lld: 指数1\\n", n);\n}\n\nint main() {\n    long long n;\n    scanf("%lld", &n);\n    factorize(n);\n    return 0;\n}`, lang: 'c' }
          ],
          quiz: { q: 'sqrt(N)まで確認すれば素数判定できる理由は？', opts: ['N/2まで確認すれば十分だから', '約数は常にペアで存在し小さい方はsqrt(N)以下だから', '偶数だけ確認すればいいから', 'Nが素数のとき必ずsqrt(N)で割れるから'], ans: 1, exp: 'Nの約数d1とd2がd1×d2=Nのペアなら、小さい方はsqrt(N)以下です。だからsqrt(N)まで確認すれば全約数が見つかります。' }
        }
      }
    ]
  },
  {
    level: 4, title: '黒帯修行', subtitle: '上級アルゴリズム', icon: '🏆', cls: 'l4',
    lessons: [
      {
        id: 'l10', title: 'ダイクストラ法', icon: '🗺️',
        desc: '重み付きグラフの最短経路を求める', xp: 300, time: '70分',
        content: {
          sections: [
            { title: 'ダイクストラ法とは', body: '辺に重みがあるグラフの最短経路を求めるアルゴリズム。優先度付きキュー（ヒープ）を使うとO((V+E)log V)で動作します。\n\n2025年第7問「レンタカー」のような問題に必要です！' },
            { title: 'ダイクストラ実装（隣接リスト）', code: `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n#define MAXN 100005\n#define INF 1e18\n\ntypedef long long ll;\ntypedef struct { int to; ll cost; } Edge;\n\nEdge edges[200005];\nint next[200005], head_e[MAXN], edge_cnt;\nll dist[MAXN];\nint visited[MAXN];\n\nvoid addEdge(int u, int v, ll c) {\n    edges[edge_cnt].to = v;\n    edges[edge_cnt].cost = c;\n    next[edge_cnt] = head_e[u];\n    head_e[u] = edge_cnt++;\n}\n\n/* 優先度付きキューの代わりに簡易実装（小N向け） */\nvoid dijkstra(int s, int n) {\n    for (int i = 1; i <= n; i++) dist[i] = (ll)1e18;\n    dist[s] = 0;\n    \n    for (int iter = 0; iter < n; iter++) {\n        int v = -1;\n        for (int i = 1; i <= n; i++)\n            if (!visited[i] && (v == -1 || dist[i] < dist[v])) v = i;\n        if (v == -1 || dist[v] == (ll)1e18) break;\n        visited[v] = 1;\n        \n        for (int e = head_e[v]; e != -1; e = next[e]) {\n            int u = edges[e].to;\n            if (dist[v] + edges[e].cost < dist[u])\n                dist[u] = dist[v] + edges[e].cost;\n        }\n    }\n}\n\nint main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    memset(head_e, -1, sizeof(head_e));\n    for (int i = 0; i < m; i++) {\n        int u, v; ll c;\n        scanf("%d %d %lld", &u, &v, &c);\n        addEdge(u, v, c);\n        addEdge(v, u, c);\n    }\n    int s, t;\n    scanf("%d %d", &s, &t);\n    dijkstra(s, n);\n    printf("%lld\\n", dist[t]);\n    return 0;\n}`, lang: 'c' }
          ],
          quiz: { q: 'ダイクストラ法が使えない条件は？', opts: ['グラフが非連結', '負の重みの辺がある', 'グラフが有向', 'ノード数が多い'], ans: 1, exp: 'ダイクストラ法は負の重みがあると正しく動作しません。負の重みがある場合はベルマン-フォード法を使います。' }
        }
      }
    ]
  }
];

// ============================================================
//  RANKS
// ============================================================
const RANKS = [
  { name: '白帯', minXP: 0,    color: '#e8e8e8', desc: '道場に入門したばかり' },
  { name: '黄帯', minXP: 200,  color: '#f0c060', desc: '基礎の形ができてきた' },
  { name: '青帯', minXP: 500,  color: '#4080e0', desc: '論理的思考が身についた' },
  { name: '茶帯', minXP: 1000, color: '#a06030', desc: 'アルゴリズムを使いこなせる' },
  { name: '黒帯', minXP: 2000, color: '#282828', desc: 'パソコン甲子園上位を狙える' },
  { name: '赤帯', minXP: 4000, color: '#e84040', desc: '全国入賞レベルの実力者' }
];

// ============================================================
//  ACHIEVEMENTS
// ============================================================
const ACHIEVEMENTS = [
  { id: 'a01', icon: '⛩️', name: '入門', desc: '道場に初めて入門した', cond: xp => xp >= 0 },
  { id: 'a02', icon: '📝', name: '最初の一歩', desc: '最初の問題を解いた', cond: (xp, s) => s >= 1 },
  { id: 'a03', icon: '🔥', name: '三日坊主を卒業', desc: '3日間連続ログイン', cond: (xp, s, streak) => streak >= 3 },
  { id: 'a04', icon: '💯', name: '十本目の矢', desc: '10問解いた', cond: (xp, s) => s >= 10 },
  { id: 'a05', icon: '🌟', name: '500XP達成', desc: 'XPが500を超えた', cond: xp => xp >= 500 },
  { id: 'a06', icon: '⚡', name: '速解き師', desc: '1分以内に問題を解いた', cond: (xp, s, str, fast) => fast },
  { id: 'a07', icon: '🏆', name: '1000XP達成', desc: 'XPが1000を超えた', cond: xp => xp >= 1000 },
  { id: 'a08', icon: '🌐', name: 'グラフ開眼', desc: 'グラフ問題を解いた', cond: (xp, s, str, fast, cats) => cats && cats.includes('graph') },
  { id: 'a09', icon: '🎯', name: '貪欲の達人', desc: '貪欲法問題を3問解いた', cond: (xp, s, str, fast, cats) => cats && cats.filter(c=>c==='greedy').length >= 3 },
  { id: 'a10', icon: '🔑', name: '黄帯昇段', desc: 'XPが200を超えた', cond: xp => xp >= 200 },
  { id: 'a11', icon: '📚', name: '全レッスン完了', desc: 'すべてのレッスンを修了', cond: (xp, s, str, fast, cats, lessons) => lessons && lessons >= 10 },
  { id: 'a12', icon: '🎭', name: '多言語修行', desc: '3種類の言語でコードを書いた', cond: (xp, s, str, fast, cats, les, langs) => langs && langs >= 3 }
];

// ============================================================
//  TOPIC SUMMARY
// ============================================================
const TOPICS = [
  { id: 'math',     name: '数学・計算', icon: '➕', color: '#30c870', problems: PROBLEMS.filter(p=>p.cat==='math').length },
  { id: 'geometry', name: '幾何',       icon: '📐', color: '#20c8b0', problems: 3 },
  { id: 'graph',    name: 'グラフ理論', icon: '🌐', color: '#8060e8', problems: PROBLEMS.filter(p=>p.cat==='graph').length },
  { id: 'dp',       name: '動的計画法', icon: '🧩', color: '#e84040', problems: 4 },
  { id: 'string',   name: '文字列',     icon: '📝', color: '#e8a020', problems: 2 },
  { id: 'greedy',   name: '貪欲法',     icon: '🎯', color: '#4080e0', problems: PROBLEMS.filter(p=>p.cat==='greedy').length }
];
