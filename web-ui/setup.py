import setuptools

with open('./README.md', 'r', encoding='utf-8') as fh:
    long_description = fh.read()

with open('./requirements.txt', 'r') as rfh:
    lib_flag = False
    requirements = []

    for line in rfh.readlines():
        if line.startswith('#') and 'lib' in line:
            lib_flag = True
        elif lib_flag and line:
            requirements.append(line)
        elif not line:
            break