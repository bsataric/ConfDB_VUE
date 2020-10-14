import argparse
parser = argparse.ArgumentParser(description='prints the dependent modules of a module')
parser.add_argument("echo", help="echo the string you use here")
args = parser.parse_args()
print(args.echo)