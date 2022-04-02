def tempchange(listpassed):
    pre = []
    post = []
    total = sum(listpassed)
    result = []
    for i, temp in enumerate(listpassed):
        if i == 0:
            pre[i] = temp
            post[i] = total
        else:
            pre[i] = temp + pre[i - 1]
            post[i] = total - pre[i - 1]

    result.append(max(pre[i], post[i]))

    return max(result)
